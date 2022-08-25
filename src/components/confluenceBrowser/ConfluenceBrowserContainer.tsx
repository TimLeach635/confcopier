import { Confluence } from "../../auth";
import React from "react";
import { ConfluenceBrowser } from "./ConfluenceBrowser";

interface ConfluenceBrowserContainerProps {
  confluences: Confluence[];
}

export const ConfluenceBrowserContainer: React.FunctionComponent<
  ConfluenceBrowserContainerProps
> = ({ confluences }) => {
  return (
    <>
      <div className="confluence-browser">
        <ConfluenceBrowser confluences={confluences} />
      </div>
      <script src="/hydrateConfluenceBrowser.js"></script>
    </>
  );
};
