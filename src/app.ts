import express from "express";
import cookieSession from "cookie-session";
import pageRoutes from "./routes/pages";
import apiRoutes from "./routes/api";

const port = 3000;

const app = express();

const key = process.env["KEY"];
if (!key) throw new Error('Environment variable "KEY" must be set');

app.use(
  cookieSession({
    name: "session",
    keys: [key],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use(express.static("dist/static"));

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

app.listen(port);
