import React, { useState } from "react";
import { Confluence } from "../../auth";
import { Space } from "../../apiClients/confluence/space";
import { ConfluenceList } from "../confluences/ConfluenceList";
import { SpaceList } from "../spaces/SpaceList";
import { browserGetSpaces } from "../../browser/api";

interface ConfluenceBrowserProps {
  confluences: Confluence[];
}

type Level = "confluences" | "spaces" | "pages";

export const ConfluenceBrowser: React.FunctionComponent<
  ConfluenceBrowserProps
> = ({ confluences }) => {
  const [level, setLevel] = useState<Level>("confluences");
  const [spaces, setSpaces] = useState<Space[]>();

  const selectConfluence = (subdomain: string) => {
    setLevel("spaces");
    browserGetSpaces(subdomain).then(setSpaces);
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
      return <SpaceList spaces={spaces} />;
  }
};
