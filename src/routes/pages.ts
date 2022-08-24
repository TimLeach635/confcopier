import express from "express";
import { renderHtml } from "../rendering";
import { ContentTreePage } from "../components/content/ContentTreePage";
import { SpaceListPage } from "../components/spaces/SpaceListPage";
import { LoginPage } from "../components/login/LoginPage";
import {
  getGlobalSpaces,
  getSpaceRootContent,
  SpaceContentResponse,
} from "../apiClients/confluence/space";
import { Content } from "../apiClients/confluence/content";
import { getWholeHierarchyFromParent } from "../services/confluence/contentService";
import { TreeNode } from "../util/tree";

const router = express.Router();

// Redirect to login page if the confluence details are not present in
// the session cookie (or that cookie doesn't exist at all)
router.use((req, res, next) => {
  if (req.method !== "GET") {
    next();
    return;
  }

  if (!req.session?.confluence) {
    res.send(renderHtml(LoginPage, "ConfCopier | Log In", false));
    res.end();
    return;
  }

  next();
});

router.get("/", (req, res) => {
  getGlobalSpaces(req.session.confluence).then(
    (response) => {
      res.send(
        renderHtml(SpaceListPage, "ConfCopier | Spaces", true, {
          spaces: response.results,
        })
      );
    },
    (reason) => {
      res.status(500).send(`<p>${reason}</p>`);
    }
  );
});

router.get("/space/:spaceKey", (req, res) => {
  getSpaceRootContent(req.session.confluence, req.params["spaceKey"])
    .then((response: SpaceContentResponse) => {
      const rootPages: Content[] = response.page.results;
      return Promise.all(
        rootPages.map((rootPage) =>
          getWholeHierarchyFromParent(req.session.confluence, rootPage.id)
        )
      );
    })
    .then(
      (hierarchies: TreeNode<Content>[]) => {
        res.send(
          renderHtml(
            ContentTreePage,
            "ConfCopier | Content",
            true,
            {
              contentTrees: hierarchies,
            },
            { contentTrees: hierarchies }
          )
        );
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

router.post("/", (req, res) => {
  if (!req.session) {
    throw new Error("Cannot access session");
  }
  req.session.confluence = req.body;
  res.redirect(303, "/");
});

router.post("/logout", (req, res) => {
  if (!req.session) {
    throw new Error("Cannot access session");
  }
  req.session.confluence = undefined;
  res.redirect(303, "/");
});

export default router;
