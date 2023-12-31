// import { DEFAULT_CLUBSPARK_ID_LIST } from "../consts";
// import { nowDateString } from "./now-date-string";
// import { generateData } from "./generate-data";
// ? TYPES:
// import { ClubSparkId } from "../consts";
// import { DateString } from "../../../types/global";
// import { ExtendedSession } from "../../../types/venue-session";

export interface State {
  // searchParams: {
  //   startDate: DateString;
  //   endDate: DateString;
  // }
  // idList: ClubSparkId[];
  // data: ExtendedSession[];
  onlyAvailables: boolean;
  rainForecast: boolean;
}

export const initialState: State = {
  // searchParams: {
  //   startDate: nowDateString(),
  //   endDate: nowDateString(),
  // },
  // idList: DEFAULT_CLUBSPARK_ID_LIST,
  // data: [],
  onlyAvailables: true,
  rainForecast: true
};

export function reducer(state: State, action: { type: string;[key: string]: unknown }): State {
  switch (action.type) {
    case "TOGGLE_ONLY_AVAILABLES": {
      return {
        ...state,
        onlyAvailables: !state.onlyAvailables
      }
    }
    case "TOGGLE_RAIN_FORECAST": {
      return {
        ...state,
        rainForecast: !state.rainForecast
      }
    }
    default: {
      return state;
    }
  }
}