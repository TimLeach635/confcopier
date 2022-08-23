import {
  Content,
  createContent,
  getContentById,
  getContentChildrenByType,
  searchContentByCql,
} from "../../apiClients/confluence/content";
import {
  flatten,
  generateTreeAsync,
  makeTrees,
  traversePromiseTree,
  Tree,
  TreeNode,
  visualiseTreeArray,
} from "../../util/tree";
import logger from "../../logging";
import { Confluence } from "../../confluence";
import { confluenceApiFetch } from "../../apiClients/confluence/common";

export const getContentDetails = async (
  confluence: Confluence,
  contentId: string
): Promise<Content> => {
  const response = await confluenceApiFetch(
    confluence,
    ["wiki", "rest", "api", "content", contentId],
    { expand: "space,children.page" }
  );
  if (!response.ok)
    throw new Error(`Fetch failed with error:\n${response.body}`);
  return (await response.json()) as Content;
};

export const getChildPagesOfContent = async (
  confluence: Confluence,
  contentId: string
): Promise<Content[]> =>
  getContentChildrenByType(confluence, contentId, "page").then(
    (contentArray) => contentArray.results
  );

export const getWholeHierarchyFromParent = async (
  confluence: Confluence,
  parentContentId: string
): Promise<TreeNode<Content>> => {
  const parent: Content = await getContentById(confluence, {
    id: parentContentId,
    expand: [],
  });

  return await generateTreeAsync<Content>(parent, (p) =>
    getContentChildrenByType(confluence, p.id, "page", []).then(
      (array) => array.results
    )
  );
};

export const copyContent = async (
  sourceConfluence: Confluence,
  destinationConfluence: Confluence,
  destinationSpaceKey: string,
  contentIds: string[],
  destinationParentId?: string
): Promise<Content[]> => {
  // Get all the content selected
  const contentArray = await searchContentByCql(sourceConfluence, {
    cql: `id IN (${contentIds.join(",")})`,
    expand: ["space", "children.page", "ancestors", "body.storage"],
    limit: contentIds.length,
  });
  const content = contentArray.results;

  let destinationParent: Content | undefined;

  if (destinationParentId !== undefined) {
    destinationParent = await getContentDetails(
      destinationConfluence,
      destinationParentId
    );
  }

  // Begin with those with no parent, and cascade down
  // TODO: Will probably fail if a page is selected but any of its ancestors aren't

  const contentTrees: Tree<Content>[] = makeTrees(
    content,
    (potentialParent: Content, potentialChild: Content) =>
      potentialParent.children.page.results
        .map((child) => child.id)
        .includes(potentialChild.id)
  );

  logger.info(`Attempting to copy content trees from ${sourceConfluence.url}:`);
  visualiseTreeArray(contentTrees, (item) => item.title);

  let creationTrees: Tree<Content>[];
  try {
    creationTrees = await Promise.all(
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
            },
            destinationParent
          ),
        };
      })
    );
    logger.info(`Successfully copied all pages`);
  } catch (e) {
    logger.error(`Failed to copy pages`);
    logger.error(JSON.stringify(e, null, 2));
  }

  visualiseTreeArray(
    creationTrees,
    (item) => `${item.title} (${item._links.self})`
  );

  return creationTrees.flatMap((creationTree) => flatten(creationTree.root));
};
