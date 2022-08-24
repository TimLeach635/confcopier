import React from "react";
import { Space } from "../../apiClients/confluence/space";

interface SpaceCardProps {
  space: Space;
}

export const SpaceCard: React.FunctionComponent<SpaceCardProps> = ({
  space,
}) => {
  return (
    <a className="space-card" href={`/space/${space.key}`}>
      <h2>{space.name}</h2>
      <p>Key: "{space.key}"</p>
      <p>Type: "{space.type}"</p>
    </a>
  );
};
