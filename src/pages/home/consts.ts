import { generateDates } from "@/utils/generate-dates";
import { WEATHER_FORECAST_DAYS } from "@/config";

export const rainForecastMaxDates: { [d: string]: true } = generateDates(new Date(), WEATHER_FORECAST_DAYS - 1).reduce((acc, [_day, d]) => ({ ...acc, [d]: true }), {});