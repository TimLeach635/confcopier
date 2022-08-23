import express from "express";
import { Confluence } from "../confluence";
import {
  copyContent,
  getChildPagesOfContent,
} from "../services/confluence/contentService";
import { getSpaceRootContent } from "../apiClients/confluence/space";

const router = express.Router();

router.get("/space/:spaceKey/root-pages", (req, res) => {
  getSpaceRootContent(req.session.confluence, req.params["spaceKey"]).then(
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
  getChildPagesOfContent(req.session.confluence, req.params["contentId"]).then(
    (response) => {
      res.send(response);
    }
  );
});

router.post("/copy", (req, res) => {
  if (!req.session?.confluence) {
    res.status(401).send("Not authorised to access this resource");
    return;
  }

  // Extract IDs of pages to copy
  const ids: string[] = Object.keys(req.body).filter(
    (key) =>
      ![
        "url",
        "username",
        "password",
        "spaceKey",
        "destinationContentRoot",
      ].includes(key)
  );

  const destConfluence: Confluence = {
    url: req.body.url,
    username: req.body.username,
    password: req.body.password,
  };

  copyContent(
    req.session.confluence,
    destConfluence,
    req.body.spaceKey,
    ids,
    req.body.destinationContentRoot || undefined
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
