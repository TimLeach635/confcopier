import express from "express";
import cookieSession from "cookie-session";
import {
  Confluence,
  copyContent,
  getChildrenOfContent,
  getGlobalSpaces,
  getSpaceRootContent
} from "./client/confluenceClient";

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

app.get("/", (req, res) => {
  if (!req.session?.confluence) {
    res.render("login");
    return;
  }

  getGlobalSpaces(req.session.confluence)
    .then((response) => {
      res.render("spaces", { spaceArray: response });
    }, (reason) => {
      res.status(500).send(`<p>${reason}</p>`);
    });
});

app.get("/space/:spaceKey", (req, res) => {
  if (!req.session?.confluence) {
    res.render("login");
    return;
  }

  getSpaceRootContent(req.session.confluence, req.params["spaceKey"])
    .then((response) => {
      res.render("content", { spaceContent: response });
    }, (reason) => {
      res.status(500).send(`<p>${reason}</p>`);
    });
});

app.get("/content/:contentId/children", (req, res) => {
  if (!req.session?.confluence) {
    res.render("login");
    return;
  }

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
    .filter(key => !["url", "username", "password", "spaceKey"].includes(key));

  const destConfluence: Confluence = {
    url: req.body.url,
    username: req.body.username,
    password: req.body.password,
  };

  copyContent(req.session.confluence, destConfluence, req.body.spaceKey, ids)
    .then((response) => {
      res.send(JSON.stringify(response));
    }, (reason) => {
      res.status(500).send(JSON.stringify(reason));
    });
})

app.listen(port);
