import React from "react";
import { renderToString } from "react-dom/server";

export const renderHtml = (Body: React.FunctionComponent, title: string): string => {
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
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/login.css" />
</head>
<body>
  ${renderToString(React.createElement(Body))}
</body>
</html>
  `;
}
