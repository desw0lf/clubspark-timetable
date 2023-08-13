import { DEFAULT_CLUBSPARK_ID_LIST } from "../consts";
import { nowDateString } from "./now-date-string";
import { generateData } from "./generate-data";
// ? TYPES:
import { ClubSparkId } from "../consts";
import { DateString } from "../../../types/global";

export interface State {
  searchParams: {
    startDate: DateString;
    endDate: DateString;
  }
  idList: ClubSparkId[];
}

export const initialState: State = {
  searchParams: {
    startDate: nowDateString(),
    endDate: nowDateString(),
  },
  idList: DEFAULT_CLUBSPARK_ID_LIST // ! TODO read from localStorage
};

export function reducer(state: State, action: any): State {
  switch (action.type) {
    case "GENERATE_DATA": {
      const data = generateData(state.idList.reduce((acc, item, i) => ({
        ...acc,
        [item.id]: action.sessions[i].data.Resources
      }), {}));
      console.log({ data });
      return state;
    }
    default: {
      return state;
    }
  }
}