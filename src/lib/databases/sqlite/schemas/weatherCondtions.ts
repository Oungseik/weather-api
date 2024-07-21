import * as D from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { cities } from "./cities";
import { config } from "src/config";

export let weatherCondtions = D.sqliteTable("weather_conditions", {
  id: D.integer("id").primaryKey({ autoIncrement: true }),
  chanceOfRain: D.integer("chance_of_rain").notNull(),
  temperature: D.integer("temperature").notNull(),
  realFeel: D.integer("real_feel").notNull(),
  wind: D.integer("wind").notNull(),
  uvIndex: D.integer("uv_index").notNull(),
  status: D.text("status", { enum: config.weatherStatus }).notNull(),
  date: D.text("date").notNull(),
  cityId: D.integer("city_id").notNull(),
});

export let weatherCondtionsRelations = relations(weatherCondtions, ({ one }) => ({
  city: one(cities, {
    fields: [weatherCondtions.cityId],
    references: [cities.id],
  }),
}));
