import { defineConfig } from "drizzle-kit";
import { config } from "src/config";

export default defineConfig({
  schema: "./src/lib/databases/sqlite/schemas/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: config.sqliteURI,
  },
  migrations: {},
  strict: true,
});
