import React from "react";
import { Content } from "../../apiClients/confluence/content";
import { TreeNode } from "../../util/tree";

interface ContentTreeProps {
  contentTree: TreeNode<Content>;
}

export const ContentTree: React.FunctionComponent<ContentTreeProps> = ({
  contentTree,
}) => {
  return (
    <details>
      <summary>
        <input
          id={`checkbox-content-${contentTree.value.id}`}
          name={`${contentTree.value.id}`}
          type="checkbox"
        />
        <label htmlFor={`checkbox-content-${contentTree.value.id}`}>
          {contentTree.value.title}
        </label>
      </summary>
      {contentTree.children.length > 0 ? (
        <ul>
          {contentTree.children.map((childNode) => (
            <li key={childNode.value.id}>
              <ContentTree contentTree={childNode} />
            </li>
          ))}
        </ul>
      ) : (
        <>No children</>
      )}
    </details>
  );
};
