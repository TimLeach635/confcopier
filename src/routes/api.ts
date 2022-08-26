import express from "express";
import { Confluence } from "../auth";
import {
  copyContent,
  getChildPagesOfContent,
  getWholeHierarchyFromParent,
} from "../services/confluence/contentService";
import { getSpaceRootContent, getSpaces } from "../apiClients/confluence/space";
import { Content } from "../apiClients/confluence/content";
import { TreeNode } from "../util/tree";

const router = express.Router();

router.get("/space/:spaceKey/root-pages", (req, res) => {
  getSpaceRootContent(
    { subdomain: req.session.confluences[0] },
    { email: req.session.email, apiKey: req.session.apiKey },
    req.params["spaceKey"]
  ).then(
    (response) => {
      res.send(response.page.results);
    },
    (reason) => {
      res.status(500).send(`
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <title>Error</title>
</head>
<body>
  <h1>Internal Server Error</h1>
  <p>${reason.message}</p>
</body>
</html>
`);
    }
  );
});

router.get("/content/:contentId/children", (req, res) => {
  getChildPagesOfContent(
    { subdomain: req.session.confluences[0] },
    { email: req.session.email, apiKey: req.session.apiKey },
    req.params["contentId"]
  ).then((response) => {
    res.send(response);
  });
});

router.get("/:subdomain/spaces", (req, res) => {
  const subdomain: string = req.params["subdomain"];

  getSpaces(
    { subdomain },
    { email: req.session.email, apiKey: req.session.apiKey }
  ).then((spaceArray) => {
    res.send(spaceArray.results);
  });
});

router.get("/:subdomain/spaces/:spaceKey/contentTrees", (req, res) => {
  const subdomain: string = req.params["subdomain"];
  const spaceKey: string = req.params["spaceKey"];

  getSpaceRootContent(
    { subdomain },
    { email: req.session.email, apiKey: req.session.apiKey },
    spaceKey
  )
    .then((response) => {
      const rootContentArray: Content[] = response.page.results;
      return Promise.all(
        rootContentArray.map((rootContent) =>
          getWholeHierarchyFromParent(
            { subdomain },
            { email: req.session.email, apiKey: req.session.apiKey },
            rootContent.id
          )
        )
      );
    })
    .then((contentTrees: TreeNode<Content>[]) => {
      res.send(contentTrees);
    });
});

router.post("/copy", (req, res) => {
  if (!req.session?.email || !req.session?.apiKey) {
    res.status(401).send("Not authorised to access this resource");
    return;
  }

  // Extract IDs of pages to copy
  const ids: string[] = Object.keys(req.body).filter(
    (key) => !["destSubdomain", "spaceKey", "destContentRoot"].includes(key)
  );

  const destConfluence: Confluence = {
    subdomain: req.body.destSubdomain,
  };

  copyContent(
    { subdomain: req.session.confluences[0] },
    destConfluence,
    { email: req.session.email, apiKey: req.session.apiKey },
    req.body.spaceKey,
    ids,
    req.body.destContentRoot || undefined
  ).then(
    (response) => {
      res.send(JSON.stringify(response));
    },
    (reason) => {
      res.status(500).send(reason.message);
    }
  );
});

export default router;
