import React from "react";
import { renderToString } from "react-dom/server";
import { Header } from "./components/header/Header";

export const renderHtml = <T>(Body: React.FunctionComponent<T>, title: string, props?: T, serverData?: any): string => {
  return `
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <title>${title}</title>
  <meta charSet="UTF-8" />
  <meta name="description" content="A tool for copying Confluence pages from one Confluence instance to another" />
  <meta name="keywords" content="Atlassian, Confluence" />
  <meta name="author" content="Tim Leach" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link type="text/css" rel="stylesheet" href="/styles.css" />
  <link type="text/css" rel="stylesheet" href="/login.css" />
  <link type="text/css" rel="stylesheet" href="/header.css" />
  <script>globalThis.SERVER_DATA = ${JSON.stringify(serverData)}</script>
</head>
<body>
  ${renderToString(React.createElement(Header))}
  ${renderToString(React.createElement(Body, props))}
</body>
</html>
  `;
}
