import React from "react";
import { hydrateRoot } from "react-dom/client";
import { ContentTrees } from "../components/content/ContentTrees";
import { getServerData } from "./common";
import { Content } from "../client/confluenceClient";

const treeRootElement = document.getElementById("content-tree-root");
hydrateRoot(
  treeRootElement,
  <ContentTrees rootContent={getServerData<{ rootContent: Content[] }>().rootContent} />
);
