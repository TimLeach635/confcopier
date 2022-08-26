import React from "react";
import { ContentTree } from "./ContentTree";
import { Content } from "../../apiClients/confluence/content";
import { flatten, TreeNode } from "../../util/tree";
import { CopyCandidate } from "../confluenceBrowser/ConfluenceBrowser";

export interface ValidOrInvalidCopyCandidate extends CopyCandidate {
  valid: boolean;
}

interface ContentTreeProps {
  contentTrees: TreeNode<Content>[];
  onContentSelect?: (content: Content) => void;
  onContentDeselect?: (content: Content) => void;
  copyCandidates?: CopyCandidate[];
}

export const ContentTrees: React.FunctionComponent<ContentTreeProps> = ({
  contentTrees,
  onContentSelect,
  onContentDeselect,
  copyCandidates,
}) => {
  const allTitles: string[] = contentTrees.flatMap((tree) =>
    flatten(tree).map((node) => node.title)
  );
  console.debug(allTitles);
  const validatedCopyCandidates: ValidOrInvalidCopyCandidate[] =
    copyCandidates?.map((copyCandidate) => {
      console.debug(copyCandidate);
      return {
        ...copyCandidate,
        valid: !allTitles.some(
          (title) => title === copyCandidate.content.title
        ),
      };
    });

  return (
    <ul className="content-trees">
      {contentTrees.map((contentTree) => (
        <li key={contentTree.value.id}>
          <ContentTree
            contentTree={contentTree}
            onContentSelect={onContentSelect}
            onContentDeselect={onContentDeselect}
            copyCandidates={validatedCopyCandidates}
          />
        </li>
      ))}
    </ul>
  );
};
