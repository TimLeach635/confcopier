import React from "react";

interface HtmlDocumentProps {
  children?: React.ReactNode;
  title: string;
}

export const HtmlDocument: React.FunctionComponent<HtmlDocumentProps> = ({
  children, title
}) => {
  return <html>
    <head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content="A tool for copying Confluence pages from one Confluence instance to another" />
      <meta name="keywords" content="Atlassian, Confluence" />
      <meta name="author" content="Tim Leach" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles.css" />
      <link rel="stylesheet" href="/login.css" />
    </head>
    <body>
      {children ? children : <></>}
    </body>
  </html>
}
