import { Confluence } from "../../auth";
import React from "react";
import { SideBySideBrowser } from "./SideBySideBrowser";

interface SideBySideBrowserContainerProps {
  confluences: Confluence[];
}

export const SideBySideBrowserContainer: React.FunctionComponent<
  SideBySideBrowserContainerProps
> = ({ confluences }) => {
  return (
    <>
      <div className="side-by-side-browser-container">
        <SideBySideBrowser confluences={confluences} />
      </div>
      <script src="/hydrateSideBySideBrowser.js"></script>
    </>
  );
};
