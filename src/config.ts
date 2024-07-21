export let config = {
  port: 8000,
  sqliteURI: ".database/weather.db",
  secret: "JSON_WEB_TOKEN_SECRET",
  weatherStatus: ["cloudy", "rainy", "sunny"],
} as const;
