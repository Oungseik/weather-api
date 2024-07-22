import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import dotenv from "dotenv";

import { config } from "./config";
import { checkHealthRouter } from "./routers/check_health";
import { authRouter } from "./routers/auth";

dotenv.config();

export let app = new Hono();

app.use(cors({ origin: ["127.0.0.1:*", "localhost:*"] }));
app.use("/static/*", serveStatic({ root: "./" }));
app.use(logger());

app.route("/", checkHealthRouter);
app.route("/api/v1/auth", authRouter);

export default {
  fetch: app.fetch,
  port: config.port,
};
