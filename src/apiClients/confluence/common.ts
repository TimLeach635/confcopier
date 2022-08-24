import fetch, { RequestInit, Response } from "node-fetch";
import logger from "../../logging";
import { ApiAuthDetails, Confluence } from "../../auth";
import { UrlBuilder } from "http-url-builder";
import { UrlParamBuilder } from "http-url-builder/dist/url-param-builder";

export const confluenceApiFetch = (
  confluence: Confluence,
  auth: ApiAuthDetails,
  path: string[],
  queryParams?: any,
  init?: RequestInit
): Promise<Response> => {
  let url = UrlBuilder.create(
    `${confluence.subdomain}.atlassian.net`,
    443,
    true
  );

  for (const pathElement of path) {
    url = url.addPath(pathElement);
  }

  let urlWithParams: UrlParamBuilder = url;

  if (queryParams) {
    for (const queryParamKey in queryParams) {
      urlWithParams = urlWithParams.addQueryParam(
        queryParamKey,
        queryParams[queryParamKey]
      );
    }
  }

  logger.http(`Making HTTP request to ${urlWithParams.build()}`);

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
      Authorization: `Basic ${btoa(`${auth.email}:${auth.apiKey}`)}`,
    },
  };

  return fetch(urlWithParams.build(), modifiedInit);
};
