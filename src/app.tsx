import express from "express";
import cookieSession from "cookie-session";
import {
  Confluence,
  copyContent,
  getChildrenOfContent,
  getGlobalSpaces,
  getSpaceRootContent
} from "./client/confluenceClient";
import React from "react";
import { renderToString } from "react-dom/server";
import { HtmlDocument } from "./components/html/HtmlDocument";
import { LoginPage } from "./components/login/LoginPage";

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const key = process.env["KEY"];
if (!key) throw new Error("Environment variable \"KEY\" must be set");

app.use(cookieSession({
  name: "session",
  keys: [key],
  maxAge: 24 * 60 * 60 * 1000,  // 24 hours
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

// Redirect to login page if the confluence details are not present in
// the session cookie (or that cookie doesn't exist at all)
app.use((req, res, next) => {
  if (req.method !== "GET") {
    next();
    return;
  }

  if (!req.session?.confluence) {
    res.send(`
    <!DOCTYPE html>
    ${renderToString(
      <HtmlDocument title="ConfCopier | Log In">
        <LoginPage />
      </HtmlDocument>
    )}
    `);
    res.end();
    return;
  }

  next();
});

app.get("/", (req, res) => {
  getGlobalSpaces(req.session.confluence)
    .then((response) => {
      res.render("spaces", { spaceArray: response });
    }, (reason) => {
      res.status(500).send(`<p>${reason}</p>`);
    });
});

app.get("/space/:spaceKey", (req, res) => {
  getSpaceRootContent(req.session.confluence, req.params["spaceKey"])
    .then((response) => {
      res.render("content", { spaceContent: response });
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

app.get("/content/:contentId/children", (req, res) => {
  getChildrenOfContent(req.session.confluence, req.params["contentId"])
    .then((response) => {
      res.send(response);
    })
});

app.post("/", (req, res) => {
  if (!req.session) {
    throw new Error("Cannot access session");
  }
  req.session.confluence = req.body;
  res.redirect(303, "/");
});

app.post("/copy", (req, res) => {
  if (!req.session?.confluence) {
    res.status(401).send("Not authorised to access this resource");
    return;
  }

  // Extract IDs of pages to copy
  const ids: string[] = Object
    .keys(req.body)
    .filter(key => !["url", "username", "password", "spaceKey", "destinationContentRoot"].includes(key));

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
  ).then((response) => {
      res.send(JSON.stringify(response));
    }, (reason) => {
      res.status(500).send(reason.message);
    });
})

app.listen(port);
