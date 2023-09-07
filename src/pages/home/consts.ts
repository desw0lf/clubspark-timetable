import { generateDates } from "@/utils/generate-dates";

export const rainForecastMaxDates: { [d: string]: true } = generateDates(new Date(), parseFloat(import.meta.env.VITE_WEATHER_FORECAST_DAYS) - 1).reduce((acc, [_day, d]) => ({ ...acc, [d]: true }), {});