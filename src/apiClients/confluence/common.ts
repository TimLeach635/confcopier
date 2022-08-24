import fetch, { RequestInit, Response } from "node-fetch";
import logger from "../../logging";
import { Confluence } from "../../auth";

export const confluenceApiFetch = (
  confluence: Confluence,
  path: string[],
  queryParams?: any,
  init?: RequestInit
): Promise<Response> => {
  let url = confluence.url + "/" + path.join("/");

  if (queryParams) {
    url += "?";
    url += Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");
  }

  logger.http(`Making HTTP request to ${url}`);

  if (init !== undefined) {
    logger.http(`Init object:`);
    logger.http(JSON.stringify(init, null, 2));
  }

  // Add auth header and X-Atlassian-Token
  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      "X-Atlassian-Token": "no-check",
      Authorization: `Basic ${btoa(
        `${confluence.username}:${confluence.password}`
      )}`,
    },
  };

  return fetch(url, modifiedInit);
};
