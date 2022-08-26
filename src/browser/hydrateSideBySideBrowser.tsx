import React from "react";
import { hydrateRoot } from "react-dom/client";
import { getServerData } from "./common";
import { Confluence } from "../auth";
import { SideBySideBrowser } from "../components/confluenceBrowser/SideBySideBrowser";

const containerElements = document.getElementsByClassName(
  "side-by-side-browser-container"
);

for (let i = 0; i < containerElements.length; i++) {
  const rootElement = containerElements[i];

  hydrateRoot(
    rootElement,
    <SideBySideBrowser
      confluences={getServerData<{ confluences: Confluence[] }>().confluences}
    />
  );
}
