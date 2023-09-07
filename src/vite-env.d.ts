/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly BASE_EXTERNAL_URL: string;
  readonly VITE_GOOGLE_API: string;
  readonly VITE_BASE_API: string; // clubspark API base URL
  readonly VITE_DEFAULT_CLUBSPARK_ID_LIST: string; // Comma and [at] separated list of e.g. `id1@label1,id2@label2`
  readonly VITE_WEATHER_API: string; // tomorrow.io API base URL
  readonly VITE_WEATHER_TOKEN: string; // tomorrow.io API key
  readonly VITE_GOOGLE_API_KEY: string; // Google API key [Only needs Places API to be enabled]
  readonly VITE_WEATHER_FORECAST_DAYS: string; // tomorrow.io max days in future (free tier is 5 days, paid up to 14)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}