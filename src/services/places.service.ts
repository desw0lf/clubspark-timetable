import { googleApi as api } from "../api";
// ? TYPES:
import { Location } from "../types/location";

interface Candidate {
  name: string;
  formatted_address: string;
  geometry: {
    location: Location;
    viewport: {
      northeast: Location;
      southwest: Location;
    }
  },
}

interface Response {
  candidates: Candidate[];
  status: "OK" | string;
}

const getFindPlaceFromText = async ({ input }: { input: string; }) => {
  const search = {
    input,
    inputtype: "textquery",
    fields: ["formatted_address", "name", "geometry"].join(",")
  };
  return await api.query(search).get("/place/findplacefromtext/json") as Response;
}

export default { getFindPlaceFromText };