import express from "express";
import { getGlobalSpaces, getSpaceRootContent } from "../apiClients/confluenceClient";
import { renderHtml } from "../rendering";
import { ContentTreePage } from "../components/content/ContentTreePage";
import { SpaceListPage } from "../components/spaces/SpaceListPage";
import { LoginPage } from "../components/login/LoginPage";

const router = express.Router();

// Redirect to login page if the confluence details are not present in
// the session cookie (or that cookie doesn't exist at all)
router.use((req, res, next) => {
  if (req.method !== "GET") {
    next();
    return;
  }

  if (!req.session?.confluence) {
    res.send(renderHtml(LoginPage, "ConfCopier | Log In"));
    res.end();
    return;
  }

  next();
});

router.get("/", (req, res) => {
  getGlobalSpaces(req.session.confluence)
    .then((response) => {
      res.send(renderHtml(SpaceListPage, "ConfCopier | Spaces", { spaces: response.results }));
    }, (reason) => {
      res.status(500).send(`<p>${reason}</p>`);
    });
});

router.get("/space/:spaceKey", (req, res) => {
  getSpaceRootContent(req.session.confluence, req.params["spaceKey"])
    .then((response) => {
      res.send(renderHtml(ContentTreePage, "ConfCopier | Content", {
        rootContent: response.page.results,
      }, { rootContent: response.page.results }));
    }, (reason) => {
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
    });
});

router.post("/", (req, res) => {
  if (!req.session) {
    throw new Error("Cannot access session");
  }
  req.session.confluence = req.body;
  res.redirect(303, "/");
});

export default router;
