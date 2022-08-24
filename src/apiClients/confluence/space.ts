import { Content, ContentArray } from "./content";
import { confluenceApiFetch } from "./common";
import { ApiAuthDetails, Confluence } from "../../auth";

export interface Space {
  id: number;
  key: string;
  name: string;
  homepage: Content;
  type: string;
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

export const getGlobalSpaces = async (
  confluence: Confluence,
  auth: ApiAuthDetails
): Promise<SpaceArray> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
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
  confluence: Confluence,
  auth: ApiAuthDetails
): Promise<SpaceArray> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
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
  auth: ApiAuthDetails,
  spaceKey: string
): Promise<SpaceContentResponse> => {
  const response = await confluenceApiFetch(
    confluence,
    auth,
    ["wiki", "rest", "api", "space", spaceKey, "content"],
    { depth: "root", expand: "children.page", limit: "1000" }
  );
  if (!response.ok) {
    if (response.status === 404) {
      const errorObject: any = await response.json();
      const message: string = errorObject.message;
      throw new Error(`Fetch failed with error:\n${message}`);
    }
    throw new Error(
      `Fetch failed with error:\n${JSON.stringify(await response.json())}`
    );
  }
  return (await response.json()) as SpaceContentResponse;
};
