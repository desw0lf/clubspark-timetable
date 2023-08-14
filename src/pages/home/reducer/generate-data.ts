import { intTimeToStr } from "../../../utils/int-time-to-str";
// ? TYPES:
import { IntTime } from "../../../types/global";
import { ExtendedSession, VenueSession, SimpleSession } from "../../../types/venue-session";

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
  const startTime = startHour * 60 as IntTime;
  const endTime = startTime + 60 as IntTime;
  const bases: ExtendedSession["bases"] = Object.entries(simpleSessions).reduce((acc, [id, v]) => {
    const foundAll = v.map((sessions) => {
      return sessions.find((s) => startTime >= s.StartTime && endTime <= s.EndTime);
    });
    return {
      ...acc,
      [id]: foundAll,
    }
  }, {});
  return {
    // todo
    availableCount: Object.values(bases).flat(1).reduce((acc, b) => typeof b.Cost === "number" ? acc + 1 : acc, 0),
    startTime,
    endTime,
    readableStartTime: intTimeToStr(startTime),
    readableEndTime: intTimeToStr(endTime),
    bases: bases,
  };
}

const generateList = (timeframe: TimeFrame) => {
  return [...Array(24).keys()].filter((t) => timeframe.EarliestStartTime <= t * 60 && timeframe.LatestEndTime >= t * 60 + 60);
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


export const generateData = (venues: { [id: string]: VenueSession }): ExtendedSession[] => {
  const timeframe = Object.values(venues).reduce((acc, { EarliestStartTime, LatestEndTime }) => {
    return {
      ...acc,
      EarliestStartTime: EarliestStartTime < acc.EarliestStartTime ? EarliestStartTime : acc.EarliestStartTime,
      LatestEndTime: LatestEndTime > acc.LatestEndTime ? LatestEndTime : acc.LatestEndTime
    }
  }, DEFAULT_TIME_FRAME);
  const simpleSessions: { [id: string]: SimpleSession[][] } = Object.entries(venues).reduce((acc, [id, v]) => {
    const allSessions = v.Resources.map(({ ID, Name, Days }) => {
      return Days[0].Sessions.map((s) => {
        return {
          ...s,
          resourceMeta: { ID, Name }
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