import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

export const googleApi = wretch(import.meta.env.VITE_GOOGLE_API).addon(QueryStringAddon).query({ key: import.meta.env.VITE_GOOGLE_API_KEY }).errorType("json").resolve(r => r.json());

export const baseApi = wretch(import.meta.env.VITE_BASE_API).addon(QueryStringAddon).errorType("json").resolve(r => r.json());

export const weatherApi = wretch(import.meta.env.VITE_WEATHER_API).addon(QueryStringAddon).query({ apikey: import.meta.env.VITE_WEATHER_TOKEN }).errorType("json").resolve(r => r.json());
