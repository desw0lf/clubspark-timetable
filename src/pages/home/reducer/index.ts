import { DEFAULT_CLUBSPARK_ID_LIST } from "../consts";
import { nowDateString } from "./now-date-string";
// import { generateData } from "./generate-data";
// ? TYPES:
import { ClubSparkId } from "../consts";
import { DateString } from "../../../types/global";
import { ExtendedSession } from "../../../types/venue-session";

export interface State {
  searchParams: {
    startDate: DateString;
    endDate: DateString;
  }
  idList: ClubSparkId[];
  data: ExtendedSession[];
  onlyAvailables: boolean;
}

export const initialState: State = {
  searchParams: {
    startDate: nowDateString(),
    endDate: nowDateString(),
  },
  idList: DEFAULT_CLUBSPARK_ID_LIST, // ! TODO read from localStorage
  data: [],
  onlyAvailables: true
};

export function reducer(state: State, _action: unknown): State {
  return state;
  // switch (action.type) {
  //   case "GENERATE_DATA": {
  //     return state;
  //   }
  //   default: {
  //     return state;
  //   }
  // }
}