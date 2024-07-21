import { config } from "src/config";

import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-node";
import { Config, Layer } from "effect";

let SqlLive = SqliteClient.layer({
  filename: Config.succeed(config.sqliteURI),
});

let DrizzleLive = SqliteDrizzle.layer.pipe(Layer.provide(SqlLive));

export let DatabaseLive = Layer.mergeAll(SqlLive, DrizzleLive);
