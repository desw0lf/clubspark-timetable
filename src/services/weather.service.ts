import { weatherApi as api } from "../api";
// ? TYPES:
import { WeatherResponse } from "@/types/weather";

const getTimelines = async ({ location, startTime, endTime }: { location: string; startTime: string; endTime: string; }) => {
  const search = {
    // apikey: import.meta.env.VITE_WEATHER_TOKEN,
    timesteps: "1h",
    units: "metric",
    timezone: "Europe/London",
    fields: ["freezingRainIntensity", "rainIntensity", "sleetIntensity", "snowIntensity", "precipitationProbability", "precipitationType"],
    location,
    startTime,
    endTime
  };
  return await api.query(search).get("/v4/timelines") as WeatherResponse;
}

export default { getTimelines };