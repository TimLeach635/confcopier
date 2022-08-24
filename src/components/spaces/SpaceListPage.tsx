import React from "react";
import { Space } from "../../apiClients/confluence/space";
import { SpaceCard } from "./SpaceCard";

interface SpaceListPageProps {
  spaces: Space[];
}

export const SpaceListPage: React.FunctionComponent<SpaceListPageProps> = ({
  spaces,
}) => {
  return (
    <>
      <h1>Spaces</h1>
      <ul className="space-list">
        {spaces.map((space) => (
          <li key={space.key}>
            <SpaceCard space={space} />
          </li>
        ))}
      </ul>
    </>
  );
};
