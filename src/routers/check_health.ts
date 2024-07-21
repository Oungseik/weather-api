import { Hono } from "hono";

let router = new Hono();

router.get("health", (c) => c.text("server is up and running"));

export { router as checkHealthRouter };
