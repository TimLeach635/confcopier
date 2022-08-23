import React from "react";
import { hydrateRoot } from "react-dom/client";
import { ContentTrees } from "../components/content/ContentTrees";
import { getServerData } from "./common";
import { Content } from "../apiClients/confluence/content";
import { TreeNode } from "../util/tree";

const treeRootElement = document.getElementById("content-tree-root");
hydrateRoot(
  treeRootElement,
  <ContentTrees
    contentTrees={
      getServerData<{ contentTrees: TreeNode<Content>[] }>().contentTrees
    }
  />
);
