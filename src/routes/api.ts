import express from "express";
import { Confluence } from "../auth";
import {
  copyContent,
  getChildPagesOfContent,
} from "../services/confluence/contentService";
import { getSpaceRootContent } from "../apiClients/confluence/space";

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
