import React from "react";
import { CallbackList } from "../lists/CallbackList";
import { Space } from "../../apiClients/confluence/space";

interface SpaceListProps {
  spaces: Space[];
  selectSpace: (spaceKey: string) => void;
}

export const SpaceList: React.FunctionComponent<SpaceListProps> = ({
  spaces,
  selectSpace,
}) => {
  return (
    <CallbackList
      elementsWithCallbacks={spaces.map((space) => ({
        element: {
          key: space.key,
          title: space.name,
          lines: [],
        },
        callbackOnClick: (e) => selectSpace(e.key),
      }))}
    />
  );
};
