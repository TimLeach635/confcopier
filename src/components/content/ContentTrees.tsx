import React from "react";
import { ContentTree } from "./ContentTree";
import { Content } from "../../apiClients/confluence/content";
import { TreeNode } from "../../util/tree";

interface ContentTreeProps {
  contentTrees: TreeNode<Content>[];
}

export const ContentTrees: React.FunctionComponent<ContentTreeProps> = ({
  contentTrees,
}) => {
  return (
    <ul className="content-trees">
      {contentTrees.map((contentTree) => (
        <li key={contentTree.value.id}>
          <ContentTree contentTree={contentTree} />
        </li>
      ))}
    </ul>
  );
};
