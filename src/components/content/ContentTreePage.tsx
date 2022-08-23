import React from "react";
import { ContentTrees } from "./ContentTrees";
import { Content } from "../../apiClients/confluence/content";
import { TreeNode } from "../../util/tree";

interface ContentTreePageProps {
  contentTrees: TreeNode<Content>[];
}

export const ContentTreePage: React.FunctionComponent<ContentTreePageProps> = ({
  contentTrees,
}) => {
  return (
    <>
      <h1>Root Content</h1>
      <form method="post" action="/api/copy">
        <div id="content-tree-root">
          <ContentTrees contentTrees={contentTrees} />
        </div>
        <label htmlFor="other-confluence-url">
          Confluence URL to copy to:{" "}
        </label>
        <input type="url" id="other-confluence-url" name="url" />
        <label htmlFor="other-confluence-username">
          Username for other Confluence:{" "}
        </label>
        <input type="text" id="other-confluence-username" name="username" />
        <label htmlFor="other-confluence-password">
          Password for other Confluence:{" "}
        </label>
        <input type="password" id="other-confluence-password" name="password" />
        <label htmlFor="other-confluence-space-key">
          Destination space key:{" "}
        </label>
        <input type="text" id="other-confluence-space-key" name="spaceKey" />
        <label htmlFor="other-confluence-content-root">
          Destination root content page ID:{" "}
        </label>
        <input
          type="text"
          id="other-confluence-content-root"
          name="destinationContentRoot"
        />
        <input type="submit" value="Copy" />
        <script src="/hydrateContentTree.js"></script>
      </form>
    </>
  );
};
