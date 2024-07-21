import * as D from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { weatherCondtions } from "./weatherCondtions";

export let cities = D.sqliteTable(
  "cities",
  {
    id: D.integer("id").primaryKey({ autoIncrement: true }),
    name: D.text("name").unique(),
    country: D.text("country"),
  },
  (table) => ({
    nameIdx: D.index("name_idx").on(table.name),
  }),
);

export let clitiesRelations = relations(cities, ({ many }) => ({
  weatherConditions: many(weatherCondtions),
}));
