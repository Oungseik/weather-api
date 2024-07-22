import { Schema as S, Schema } from "@effect/schema";

export const WeatherQuery = S.Struct({
  latitude: S.String.pipe(Schema.parseNumber).pipe(S.nonNaN()),
  longitude: S.String.pipe(Schema.parseNumber).pipe(S.nonNaN()),
});

export type WeatherQuery = S.Schema.Type<typeof WeatherQuery>;

interface Weather7Days {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: "°C";
    temperature_2m_min: "°C";
    uv_index_max: string;
    precipitation_sum: "mm";
    rain_sum: "mm";
    wind_speed_10m_max: "km/h";
    wind_direction_10m_dominant: "°";
  };
  daily: WeatherData[];
}

interface WeatherData {
  time: string;
  weather_code: number;
  temperature_2m_min: number;
  temperature_2m_max: number;
  apparent_temperature_max: number;
  apparent_temperature_min: number;
  uv_index_max: number;
  precipitation_sum: number;
  rain_sum: number;
  wind_speed_10m_max: number;
  wind_direction_10m_dominant: number;
}

export function parseDailyData(data: any): Weather7Days {
  let { daily } = data;
  return {
    ...data,
    daily: daily.time.map((time: string, i: number) => ({
      time,
      weather_code: daily.weather_code[i],
      temperature_2m_min: daily.temperature_2m_min[i],
      temperature_2m_max: daily.temperature_2m_max[i],
      apparent_temperature_max: daily.apparent_temperature_max[i],
      apparent_temperature_min: daily.apparent_temperature_min[i],
      uv_index_max: daily.uv_index_max[i],
      precipitation_sum: daily.precipitation_sum[i],
      rain_sum: daily.rain_sum[i],
      wind_speed_10m_max: daily.wind_speed_10m_max[i],
      wind_direction_10m_dominant: daily.wind_direction_10m_dominant[i],
    })),
  };
}
