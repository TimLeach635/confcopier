import { Confluence } from "../../auth";
import React from "react";
import { CallbackList } from "../lists/CallbackList";

interface ConfluenceListProps {
  confluences: Confluence[];
  selectConfluence: (subdomain: string) => void;
}

export const ConfluenceList: React.FunctionComponent<ConfluenceListProps> = ({
  confluences,
  selectConfluence,
}) => {
  return (
    <CallbackList
      elementsWithCallbacks={confluences.map((confluence) => ({
        element: {
          key: confluence.subdomain,
          title: confluence.subdomain,
          lines: [],
        },
        callbackOnClick: (e) => selectConfluence(e.key),
      }))}
    />
  );
};
