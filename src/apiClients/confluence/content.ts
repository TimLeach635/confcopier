import { ApiAuthDetails, Confluence } from "../../auth";
import { confluenceApiFetch } from "./common";
import logger from "../../logging";
import { Space } from "./space";

export type ContentExpandOption =
  | "childTypes.all"
  | "childTypes.attachment"
  | "childTypes.comment"
  | "childTypes.page"
  | "container"
  | "metadata.currentuser"
  | "metadata.properties"
  | "metadata.labels"
  | "metadata.frontend"
  | "operations"
  | "children.page"
  | "children.attachment"
  | "children.comment"
  | "restrictions.read.restrictions.user"
  | "restrictions.read.restrictions.group"
  | "restrictions.update.restrictions.user"
  | "restrictions.update.restrictions.group"
  | "history"
  | "history.lastUpdated"
  | "history.previousVersion"
  | "history.contributors"
  | "history.nextVersion"
  | "ancestors"
  | "body"
  | "body.storage"
  | "body.view"
  | "version"
  | "descendants.page"
  | "descendants.attachment"
  | "descendants.comment"
  | "space";

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

export interface ContentArray {
  results: Content[];
  start: number;
  limit: number;
  size: number;
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

export interface GetContentRequest {
  spaceKey?: string;
  title?: string;
  expand?: ContentExpandOption[];
  start?: number;
  limit?: number;
}

export const getContent = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  request?: GetContentRequest
): Promise<ContentArray> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content"],
    {
      ...request,
      expand: request?.expand?.join(","),
    }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as ContentArray;
};

export interface GetContentByIdRequest {
  id: string;
  expand?: ContentExpandOption[];
}

export const getContentById = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  request: GetContentByIdRequest
): Promise<Content> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content", request.id],
    {
      expand: request.expand?.join(","),
    }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as Content;
};

export interface SearchContentByCqlRequest {
  cql: string;
  cqlcontext?: {
    spaceKey?: string;
    contentId?: string;
    contentStatuses?: string;
  };
  expand?: ContentExpandOption[];
  cursor?: string;
  limit?: number;
}

export const searchContentByCql = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  request: SearchContentByCqlRequest
): Promise<ContentArray> => {
  const queryParams: any = Object(request);
  if (request.cqlcontext !== undefined)
    queryParams.cqlcontext = JSON.stringify(request.cqlcontext);
  if (request.expand !== undefined)
    queryParams.expand = request.expand.join(",");

  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content", "search"],
    queryParams
  );
  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Fetch failed with error:\n${JSON.stringify(body)}`);
  }
  return (await response.json()) as ContentArray;
};

export const createContent = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
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
    logger.debug(
      `Attempting to create page "${title}" in ${confluence.subdomain}.atlassian.net, space ${spaceKey}, as a child of page ${parentId}`
    );
    request.ancestors.push({ id: parentId });
  } else {
    logger.debug(
      `Attempting to create page "${title}" in ${confluence.subdomain}.atlassian.net, space ${spaceKey}`
    );
  }

  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content"],
    undefined,
    {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const body = await response.json();
    logger.error(`Failed to create page "${title}"`);
    logger.error(JSON.stringify(body, null, 2));
    throw new Error(`Fetch failed with error:\n${JSON.stringify(body)}`);
  }
  const createdContent: Content = (await response.json()) as Content;
  logger.debug(
    `Successfully created page "${title}" at ${createdContent._links.self}`
  );
  return createdContent;
};

export const getContentChildrenByType = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  id: string,
  type: "page" | "comment" | "attachment",
  expand?: ContentExpandOption[]
): Promise<ContentArray> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content", id, "child", type],
    {
      expand: expand?.join(","),
      limit: 1000,
    }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as ContentArray;
};

export const getContentDescendantsByType = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  id: string,
  type: "page" | "comment" | "attachment",
  expand?: ContentExpandOption[]
): Promise<ContentArray> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content", id, "descendant", type],
    {
      expand: expand?.join(","),
      limit: 1000,
    }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as ContentArray;
};

export interface CopyPageHierarchyRequest {
  id: string;
  destinationPageId: string;
  copyPermissions?: boolean;
  copyLabels?: boolean;
  titleOptions?: {
    prefix?: string;
    replace?: string;
    search?: string;
  };
}

export interface LongTask {
  ari: string;
  id: string;
  links: any;
}

export const copyPageHierarchy = async (
  confluence: Confluence,
  auth: ApiAuthDetails,
  request: CopyPageHierarchyRequest
): Promise<LongTask> => {
  const requestBody: any = {
    destinationPageId: request.destinationPageId,
  };

  if (request.copyPermissions)
    requestBody.copyPermissions = request.copyPermissions;
  if (request.copyLabels) requestBody.copyLabels = request.copyLabels;
  if (request.titleOptions) requestBody.titleOptions = request.titleOptions;

  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "content", request.id, "pagehierarchy", "copy"],
    undefined,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Fetch failed with error:\n${JSON.stringify(body)}`);
  }
  return (await response.json()) as LongTask;
};
