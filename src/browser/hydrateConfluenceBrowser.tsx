import React from "react";
import { hydrateRoot } from "react-dom/client";
import { getServerData } from "./common";
import { ConfluenceBrowser } from "../components/confluenceBrowser/ConfluenceBrowser";
import { Confluence } from "../auth";

const confluenceBrowserRootElements =
  document.getElementsByClassName("confluence-browser");

for (let i = 0; i < confluenceBrowserRootElements.length; i++) {
  const rootElement = confluenceBrowserRootElements[i];

  hydrateRoot(
    rootElement,
    <ConfluenceBrowser
      confluences={getServerData<{ confluences: Confluence[] }>().confluences}
    />
  );
}
