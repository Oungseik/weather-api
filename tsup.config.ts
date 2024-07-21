import { defineConfig } from "tsup";
import { env } from "node:process";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "node22",
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  inject: env.PRODUCTION ? [] : ["./sourcemap-support.js"],
});
