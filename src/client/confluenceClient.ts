import fetch from "node-fetch";
import { flatten, makeTrees, traversePromiseTree, Tree } from "../util/tree";

export interface Confluence {
  url: string;
  username: string;
  password: string;
}

export interface ContentChildren {
  attachment: ContentArray;
  comment: ContentArray;
  page: ContentArray;
}

export interface ContentBody {
  value: string;
  representation: string;
}

export interface Content {
  id: string;
  type: "page" | "blogpost" | "attachment" | "content";
  status: string;
  title: string;
  space?: Space;
  ancestors?: Content[];
  children?: ContentChildren;
  body?: {
    storage?: ContentBody;
  };
  _links: any;
}

export interface Space {
  id: number;
  key: string;
  name: string;
  homepage: Content;
  type: string;
}

export interface ContentArray {
  results: Content[];
  start: number;
  limit: number;
  size: number;
}

export interface SpaceArray {
  results: Space[];
  start: number;
  limit: number;
  size: number;
}

export interface SpaceContentResponse {
  page: ContentArray;
  blogpost: ContentArray;
}

export interface ContentBodyCreate {
  value: string;
  representation: string;
}

export interface CreateContentRequest {
  title: string;
  type: "page" | "blogpost" | "comment";
  space: {
    key: string;
  };
  ancestors: { id: string }[];
  body: {
    storage: ContentBodyCreate;
  };
}

const confluenceFetch = (
  confluence: Confluence,
  path: string[],
  queryParams?: any
) => {
  let url = confluence.url + "/" + path.join("/");

  if (queryParams) {
    url += "?";
    url += Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");
  }

  return fetch(url, {
    headers: {
      "X-Atlassian-Token": "no-check",
      Authorization: `Basic ${btoa(
        `${confluence.username}:${confluence.password}`
      )}`,
    },
  });
};

const confluencePost = (
  confluence: Confluence,
  path: string[],
  body: any,
  queryParams?: any
) => {
  let url = confluence.url + "/" + path.join("/");

  if (queryParams) {
    url += "?";
    url += Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");
  }

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "X-Atlassian-Token": "no-check",
      Authorization: `Basic ${btoa(
        `${confluence.username}:${confluence.password}`
      )}`,
      "Content-Type": "application/json",
    },
  });
};

export const getContent = async (
  confluence: Confluence,
  spaceKey: string
): Promise<ContentArray> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "content"],
    { spaceKey: spaceKey, expand: "space,ancestors" }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as ContentArray;
};

export const searchContent = async (
  confluence: Confluence,
  cql: string,
  expand: string,
  limit: number = 25
): Promise<ContentArray> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "content", "search"],
    { cql: cql, expand: expand, limit: limit }
  );
  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Fetch failed with error:\n${JSON.stringify(body)}`);
  }
  return (await response.json()) as ContentArray;
};

export const getContentDetails = async (
  confluence: Confluence,
  contentId: string
): Promise<Content> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "content", contentId],
    { expand: "space,children.page" }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as Content;
};

export const getChildrenOfContent = async (
  confluence: Confluence,
  contentId: string
): Promise<Content[]> => {
  const parent = await getContentDetails(confluence, contentId);
  return parent.children.page.results;
};

export const getGlobalSpaces = async (
  confluence: Confluence
): Promise<SpaceArray> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "space"],
    { type: "global" }
  );
  if (!response.ok)
    throw new Error(
      `Fetch failed with error:\n${JSON.stringify(await response.json())}`
    );
  return (await response.json()) as SpaceArray;
};

export const getSpaces = async (
  confluence: Confluence
): Promise<SpaceArray> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "space"],
    { type: "global" }
  );
  if (!response.ok)
    throw new Error(
      `Fetch failed with error:\n${JSON.stringify(await response.json())}`
    );
  return (await response.json()) as SpaceArray;
};

export const getSpaceRootContent = async (
  confluence: Confluence,
  spaceKey: string
): Promise<SpaceContentResponse> => {
  const response = await confluenceFetch(
    confluence,
    ["wiki", "rest", "api", "space", spaceKey, "content"],
    { depth: "root", expand: "children.page" }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as SpaceContentResponse;
};

export const createContent = async (
  confluence: Confluence,
  title: string,
  spaceKey: string,
  body: string,
  parentId?: string
): Promise<Content> => {
  const request: CreateContentRequest = {
    title: title,
    type: "page",
    space: { key: spaceKey },
    ancestors: [],
    body: {
      storage: {
        value: body,
        representation: "storage",
      },
    },
  };

  if (parentId !== undefined) {
    request.ancestors.push({ id: parentId });
  }

  const response = await confluencePost(
    confluence,
    ["wiki", "rest", "api", "content"],
    request
  );

  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Fetch failed with error:\n${JSON.stringify(body)}`);
  }
  return (await response.json()) as Content;
};

export const copyContent = async (
  sourceConfluence: Confluence,
  destinationConfluence: Confluence,
  destinationSpaceKey: string,
  contentIds: string[]
): Promise<Content[]> => {
  // Get all the content selected
  const contentArray = await searchContent(
    sourceConfluence,
    `id IN (${contentIds.join(",")})`,
    "space,children.page,ancestors,body.storage",
    contentIds.length
  );
  const content = contentArray.results;

  // Begin with those with no parent, and cascade down
  // TODO: Will probably fail if a page is selected but any of its ancestors aren't

  const contentTrees: Tree<Content>[] = makeTrees(
    content,
    (potentialParent: Content, potentialChild: Content) =>
      potentialParent
        .children
        .page
        .results
        .map(child => child.id)
        .includes(potentialChild.id)
  );

  const creationTrees: Tree<Content>[] = await Promise.all(
    contentTrees.map(async (contentTree) => {
      return {
        root: await traversePromiseTree<Content, Content>(
          contentTree.root,
          (nodeValue: Content, prevOutput?: Content) => {
            if (prevOutput === undefined) {
              return createContent(
                destinationConfluence,
                nodeValue.title,
                destinationSpaceKey,
                nodeValue.body.storage.value
              );
            } else {
              return createContent(
                destinationConfluence,
                nodeValue.title,
                destinationSpaceKey,
                nodeValue.body.storage.value,
                prevOutput.id
              );
            }
          }
        ),
      };
    })
  );

  return creationTrees.flatMap(creationTree => flatten(creationTree.root));
};