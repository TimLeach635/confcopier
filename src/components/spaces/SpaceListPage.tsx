import React from "react";
import { Space } from "../../client/confluenceClient";

interface SpaceListPageProps {
  spaces: Space[];
}

export const SpaceListPage: React.FunctionComponent<SpaceListPageProps> = ({ spaces }) => {
  return <>
    <h1>Spaces</h1>
    <ul>
      {spaces.map(space =>
        <li>
          <a href={`/space/${space.key}`}>
            <h2>{space.name}</h2>
          </a>
          <p>Key: "{space.key}"</p>
          <p>Type: "{space.type}"</p>
        </li>
      )}
    </ul>
  </>
}
