import { Hono } from "hono";
import { Effect as E } from "effect";
import { Schema as S, ArrayFormatter } from "@effect/schema";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";

import { WeatherQuery, parseDailyData } from "@/parsers";
import { BadRequestError, InternalServerError } from "@/errors";
import { config } from "src/config";

const DAILY_WEATHER_CONDTIONS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "uv_index_max",
  "precipitation_sum",
  "rain_sum",
  "wind_speed_10m_max",
  "wind_direction_10m_dominant",
].join(",");

let router = new Hono();

router.get("/daily", async (c) => {
  let createUrl = (arg: { latitude: number; longitude: number; daily: string }) =>
    `${config.weatherApiUrl}?latitude=${arg.latitude}&longitude=${arg.longitude}&daily=${arg.daily}`;

  let program = S.decodeUnknown(WeatherQuery)(c.req.query()).pipe(
    E.catchTag("ParseError", (e) => {
      let message = ArrayFormatter.formatErrorSync(e);
      return E.fail(new BadRequestError(message));
    }),
    E.map((query) => createUrl({ ...query, daily: DAILY_WEATHER_CONDTIONS })),
    E.map(HttpClientRequest.get),
    E.map(HttpClient.fetch),
    E.flatMap(HttpClientResponse.json),
    E.catchTags({
      RequestError: () => E.fail(new InternalServerError("error occured while fetching data")),
      ResponseError: () => E.fail(new InternalServerError("error occured while fetching data")),
    }),
    E.map(parseDailyData),
    E.map((res) => c.json(res)),
  );

  let runnable = program.pipe(E.catchAll((e) => E.succeed(e.intoResponse())));
  return E.runPromise(runnable);
});

export { router as weatherRouter };
