import React from "react";
import { Content } from "../../client/confluenceClient";
import { ContentCard } from "./ContentCard";

interface ContentTreePageProps {
  contentList: Content[];
}

export const ContentTreePage: React.FunctionComponent<ContentTreePageProps> = ({ contentList }) => {
  return <>
    <h1>Root Content</h1>
    <form method="post" action="/copy">
      <ul>
        {contentList.map(content =>
          <li>
            <ContentCard content={content} />
          </li>
        )}
      </ul>
      <label htmlFor="other-confluence-url">Confluence URL to copy to: </label>
      <input type="url" id="other-confluence-url" name="url" />
      <label htmlFor="other-confluence-username">Username for other Confluence: </label>
      <input type="text" id="other-confluence-username" name="username" />
      <label htmlFor="other-confluence-password">Password for other Confluence: </label>
      <input type="password" id="other-confluence-password" name="password" />
      <label htmlFor="other-confluence-space-key">Destination space key: </label>
      <input type="text" id="other-confluence-space-key" name="spaceKey" />
      <label htmlFor="other-confluence-content-root">Destination root content page ID: </label>
      <input type="text" id="other-confluence-content-root" name="destinationContentRoot" />
      <input type="submit" value="Copy" />
    </form>
    <script src="/expandContent.js"></script>
  </>
}
