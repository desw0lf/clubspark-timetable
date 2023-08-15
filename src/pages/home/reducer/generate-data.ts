import { intTimeToStr } from "../../../utils/int-time-to-str";
import { DEFAULT_INTERVAL } from "@/config";
// ? TYPES:
import { IntTime } from "../../../types/global";
import { ExtendedSession, VenueSession, SimpleSession } from "../../../types/venue-session";
import { ClubSparkId } from "../consts";

interface TimeFrame {
  EarliestStartTime: IntTime;
  LatestEndTime: IntTime;
  [otherKeys: string]: unknown;
}


const DEFAULT_TIME_FRAME: TimeFrame = {
  EarliestStartTime: 420, // from 7
  LatestEndTime: 1320 // till 22
};

const generateSession = (startHour: number, simpleSessions: { [id: string]: SimpleSession[][] }): ExtendedSession => {
  const startTime = startHour * DEFAULT_INTERVAL as IntTime;
  const endTime = startTime + DEFAULT_INTERVAL as IntTime;
  const bases: ExtendedSession["bases"] = Object.entries(simpleSessions).reduce((acc, [id, v]) => {
    const foundAll = v.map((sessions) => {
      const found = sessions.find((s) => startTime >= s.StartTime && endTime <= s.EndTime);
      if (found) {
        const intervalSlots = (found.EndTime - startTime) / DEFAULT_INTERVAL;
        const intervals = Array.from({ length: intervalSlots }, (_, i) => (i + 1) * DEFAULT_INTERVAL);
        return { ...found, intervals };
      }
      return undefined;
    });
    return {
      ...acc,
      [id]: foundAll,
    }
  }, {});
  return {
    availableCount: Object.values(bases).flat(1).reduce((acc, b) => typeof b.Cost === "number" ? acc + 1 : acc, 0),
    startTime,
    endTime,
    readableStartTime: intTimeToStr(startTime),
    readableEndTime: intTimeToStr(endTime),
    bases: bases,
  };
}

const generateList = (timeframe: TimeFrame) => {
  return [...Array(24).keys()].filter((t) => timeframe.EarliestStartTime <= t * DEFAULT_INTERVAL && timeframe.LatestEndTime >= t * DEFAULT_INTERVAL + DEFAULT_INTERVAL);
}

// const DEFAULT_LIST = generateList(DEFAULT_TIME_FRAME);

// const PLACEHOLDER_RESOURCES = [
//   {
//     ID: "-1",
//     Name: "Court X",
//     Number: 0,
//     Location: 0,
//     Lighting: 1,
//     Surface: 6,
//     Size: 0,
//     Category: 0,
//     Days: [
//       {
//         Date: "2023-08-12T00:00:00", // todo
//         Sessions: []
//         // Sessions: DEFAULT_LIST.map((hour) => generateSession(hour, {}))
//       }
//     ]
//   },
// ];


export const generateData = (venues: { [id: string]: VenueSession }, idList: ClubSparkId[]): ExtendedSession[] => {
  const timeframe = Object.values(venues).reduce((acc, { EarliestStartTime, LatestEndTime }) => {
    return {
      ...acc,
      EarliestStartTime: EarliestStartTime < acc.EarliestStartTime ? EarliestStartTime : acc.EarliestStartTime,
      LatestEndTime: LatestEndTime > acc.LatestEndTime ? LatestEndTime : acc.LatestEndTime
    }
  }, DEFAULT_TIME_FRAME);
  const simpleSessions: { [id: string]: SimpleSession[][] } = Object.entries(venues).reduce((acc, [id, v]) => {
    const venueIndex = idList.findIndex((value) => value.id === id);
    const allSessions = v.Resources.map(({ ID, Name, Days }) => {
      return Days[0].Sessions.map((s) => {
        return {
          ...s,
          resourceMeta: { ID, Name, venueIndex }
        };
      });
    });
    return {
      ...acc,
      [id]: allSessions
    };
  }, {});
  return generateList(timeframe).map((hour) => {
    return generateSession(hour, simpleSessions);
  });
};