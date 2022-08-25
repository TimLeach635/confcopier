import React from "react";
import { Space } from "../../apiClients/confluence/space";
import { SpaceCard } from "./SpaceCard";

interface SpaceListProps {
  spaces: Space[];
}

export const SpaceList: React.FunctionComponent<SpaceListProps> = ({
  spaces,
}) => {
  return (
    <ul className="space-list">
      {spaces.map((space) => (
        <li key={space.key}>
          <SpaceCard space={space} />
        </li>
      ))}
    </ul>
  );
};
