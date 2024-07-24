import * as D from "drizzle-orm/sqlite-core";

export let users = D.sqliteTable(
  "users",
  {
    id: D.integer("id").primaryKey({ autoIncrement: true }),
    name: D.text("name").notNull(),
    email: D.text("email").unique().notNull(),
    password: D.text("password").notNull(),
  },
  (table) => ({
    emailIdx: D.index("email_idx").on(table.email),
  }),
);
