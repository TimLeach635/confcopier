import React, { useState } from "react";
import { Confluence } from "../../auth";
import { Space } from "../../apiClients/confluence/space";
import { ConfluenceList } from "../confluences/ConfluenceList";
import { SpaceList } from "./BrowserSpaceList";
import {
  browserGetSpaceContentTrees,
  browserGetSpaces,
} from "../../browser/api";
import { Content } from "../../apiClients/confluence/content";
import { TreeNode } from "../../util/tree";
import { ContentTrees } from "../content/ContentTrees";

interface ConfluenceBrowserProps {
  confluences: Confluence[];
}

type Level = "confluences" | "spaces" | "pages";

export const ConfluenceBrowser: React.FunctionComponent<
  ConfluenceBrowserProps
> = ({ confluences }) => {
  const [level, setLevel] = useState<Level>("confluences");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>();
  const [spaces, setSpaces] = useState<Space[]>();
  const [selectedSpaceKey, setSelectedSpaceKey] = useState<string>();
  const [contentTreesBySpace, setContentTreesBySpace] = useState<{
    [key: string]: TreeNode<Content>[];
  }>({});

  const selectConfluence = (subdomain: string) => {
    setLevel("spaces");
    setSelectedSubdomain(subdomain);
    browserGetSpaces(subdomain).then(setSpaces);
  };

  const selectSpace = (spaceKey: string) => {
    setLevel("pages");
    setSelectedSpaceKey(spaceKey);
    browserGetSpaceContentTrees(selectedSubdomain, spaceKey).then(
      (contentTrees) => {
        setContentTreesBySpace((prevObject) => {
          return {
            ...prevObject,
            [spaceKey]: contentTrees,
          };
        });
      }
    );
  };

  switch (level) {
    case "confluences":
      return (
        <ConfluenceList
          confluences={confluences}
          selectConfluence={selectConfluence}
        />
      );
    case "spaces":
      if (spaces === undefined) {
        return <p>Loading...</p>;
      }
      return <SpaceList spaces={spaces} selectSpace={selectSpace} />;
    case "pages":
      if (contentTreesBySpace[selectedSpaceKey] === undefined) {
        return <p>Loading...</p>;
      }
      return (
        <ContentTrees contentTrees={contentTreesBySpace[selectedSpaceKey]} />
      );
  }
};
