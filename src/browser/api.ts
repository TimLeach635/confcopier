import { Space } from "../apiClients/confluence/space";
import { Content } from "../apiClients/confluence/content";
import { TreeNode } from "../util/tree";

export const browserGetSpaces = async (subdomain: string): Promise<Space[]> => {
  const response = await fetch(`/api/${subdomain}/spaces`);
  return await response.json();
};

export const browserGetSpaceContentTrees = async (
  subdomain: string,
  spaceKey: string
): Promise<TreeNode<Content>[]> => {
  const response = await fetch(
    `/api/${subdomain}/spaces/${spaceKey}/contentTrees`
  );
  return await response.json();
};
