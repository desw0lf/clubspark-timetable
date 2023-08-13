// ? TYPES:
import { IntTime } from "../../../types/global";
import { Resource, ExtendedSession } from "../../../types/venue-session";

const generateSession = (startHour: number): ExtendedSession => {
  const startTime = startHour * 60 as IntTime;
  const endTime = startTime + 60 as IntTime;
  return {
    ID: startHour.toString(),
    Category: 1000,
    SubCategory: 0,
    Name: "Temporary",
    Colour: "#fcfabd",
    StartTime: startTime,
    EndTime: endTime,
    Interval: 60,
    MaxSinglesSlots: 0,
    MaxDoublesSlots: 0,
    Capacity: 0,
    Recurrence: false,
    CostFrom: 0.0,
    CourtCost: 6.00,
    LightingCost: 0.00,
    MemberPrice: 0.0,
    GuestPrice: 0.0,
    extended: {}
  };
}

const DEFAULT_LIST = [...Array(24).keys()];

const PLACEHOLDER_RESOURCES = [
  {
    ID: "-1",
    Name: "Court X",
    Number: 0,
    Location: 0,
    Lighting: 1,
    Surface: 6,
    Size: 0,
    Category: 0,
    Days: [
      {
        Date: "2023-08-12T00:00:00", // todo
        Sessions: DEFAULT_LIST.map((hour) => generateSession(hour))
      }
    ]
  },
];
     

export const generateData = (resources: { [id: string]: Resource[] }): ExtendedSession[] => {
  console.log({resources});
  return DEFAULT_LIST.map((hour) => {
    return generateSession(hour);
  });
};