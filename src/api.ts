import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

const api = wretch(import.meta.env.VITE_BASE_API).addon(QueryStringAddon).errorType("json").resolve(r => r.json());

export default api;