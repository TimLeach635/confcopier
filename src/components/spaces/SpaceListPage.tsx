import React from "react";
import { Space } from "../../apiClients/confluence/space";
import { SpaceList } from "./SpaceList";

interface SpaceListPageProps {
  spaces: Space[];
}

export const SpaceListPage: React.FunctionComponent<SpaceListPageProps> = ({
  spaces,
}) => {
  return (
    <>
      <h1>Spaces</h1>
      <SpaceList spaces={spaces} />
    </>
  );
};
