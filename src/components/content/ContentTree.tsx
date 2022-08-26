import React, { useState } from "react";
import { Content } from "../../apiClients/confluence/content";
import { TreeNode } from "../../util/tree";
import { ValidOrInvalidCopyCandidate } from "./ContentTrees";

interface ContentTreeProps {
  contentTree: TreeNode<Content>;
  onContentSelect?: (content: Content) => void;
  onContentDeselect?: (content: Content) => void;
  copyCandidates?: ValidOrInvalidCopyCandidate[];
}

export const ContentTree: React.FunctionComponent<ContentTreeProps> = ({
  contentTree,
  onContentSelect,
  onContentDeselect,
  copyCandidates,
}) => {
  const [checked, setChecked] = useState(false);

  const onCheckboxToggle: React.ChangeEventHandler<HTMLInputElement> = () => {
    if (checked) {
      setChecked(false);
      onContentDeselect(contentTree.value);
    } else {
      setChecked(true);
      onContentSelect(contentTree.value);
    }
  };

  return (
    <details>
      <summary>
        <input
          id={`checkbox-content-${contentTree.value.id}`}
          name={`${contentTree.value.id}`}
          type="checkbox"
          onChange={onCheckboxToggle}
          checked={checked}
        />
        <label htmlFor={`checkbox-content-${contentTree.value.id}`}>
          {contentTree.value.title}
        </label>
      </summary>
      {contentTree.children.length > 0 ? (
        <ul>
          {contentTree.children.map((childNode) => (
            <li key={childNode.value.id}>
              <ContentTree
                contentTree={childNode}
                onContentSelect={onContentSelect}
                onContentDeselect={onContentDeselect}
              />
            </li>
          ))}
          {copyCandidates !== undefined &&
          copyCandidates.some(
            (copyCandidate) =>
              copyCandidate.destParentId === contentTree.value.id
          ) ? (
            copyCandidates
              .filter(
                (copyCandidate) =>
                  copyCandidate.destParentId === contentTree.value.id
              )
              .map((copyCandidate) => (
                <li
                  key={copyCandidate.content.id}
                  className={`copy-candidate ${
                    copyCandidate.valid ? "" : "copy-candidate--invalid"
                  }`}
                >
                  {copyCandidate.content.title}
                </li>
              ))
          ) : (
            <></>
          )}
        </ul>
      ) : (
        <>No children</>
      )}
    </details>
  );
};
