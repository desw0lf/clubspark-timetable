import { DEFAULT_CLUBSPARK_ID_LIST } from "./consts";
// ? TYPES:
import { DateString } from "../../types/global";

export interface State {
  searchParams: {
    startDate: DateString;
    endDate: DateString;
  }
  idList: string[];
}

const nowDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
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
      console.log({action});
      return state;
    }
    default: {
      return state;
    }
  }
}