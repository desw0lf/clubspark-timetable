import { intTimeToStr } from "../../../utils/int-time-to-str";
import { DEFAULT_INTERVAL } from "@/config";
import { generateDate } from "@/utils/generate-dates";

// ? TYPES:
import { IntTime } from "../../../types/global";
import { ExtendedSession, VenueSession, SimpleSession } from "../../../types/venue-session";
import { ClubSparkId } from "../../../consts";
interface TimeFrame {
  EarliestStartTime: IntTime;
  LatestEndTime: IntTime;
  [otherKeys: string]: unknown;
}


const DEFAULT_TIME_FRAME: TimeFrame = {
  EarliestStartTime: 420, // from 7
  LatestEndTime: 1320 // till 22
};

const generateSession = (startHour: number, simpleSessions: { [id: string]: SimpleSession[][] }, loadedDate: string): ExtendedSession => {
  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  const startTime = startHour * DEFAULT_INTERVAL as IntTime;
  const endTime = startTime + DEFAULT_INTERVAL as IntTime;
  const readableStartTime = intTimeToStr(startTime);
  const bases: ExtendedSession["bases"] = Object.entries(simpleSessions).reduce((acc, [id, v]) => {
    const foundAll = v.map((sessions) => {
      const found = sessions.find((s) => startTime >= s.StartTime && endTime <= s.EndTime);
      if (found) {
        const intervalSlots = (found.EndTime - startTime) / DEFAULT_INTERVAL;
        const intervals = Array.from({ length: intervalSlots }, (_, i) => {
          const interval = (i + 1) * DEFAULT_INTERVAL;
          return {
            interval,
            readableStartTime,
            readableEndTime: intTimeToStr(startTime + interval)
          };
        });
        const readableCost = typeof found.Cost === "number" ? GBP.format(found.Cost) : undefined;
        return { ...found, intervals, readableCost };
      }
      return undefined;
    });
    return {
      ...acc,
      [id]: foundAll,
    }
  }, {});
  const now = new Date();
  const dateToday = generateDate(now);
  const isToday = dateToday === loadedDate;
  const isHistorical = isToday && startHour <= now.getHours() - 1;
  const isNowHour = startHour === now.getHours();
  const percentageOfTimePassedInSlot = isToday && isNowHour ? Math.round(100 / 60 * now.getMinutes()) : -1;
  return {
    availableCount: Object.values(bases).flat(1).reduce((acc, base) => {
      const b = base || {};
      return typeof b.Cost === "number" ? acc + 1 : acc;
    }, 0),
    startTime,
    endTime,
    readableStartTime,
    readableEndTime: intTimeToStr(endTime),
    isHistorical,
    percentageOfTimePassedInSlot,
    bases: bases,
  };
}

const generateList = (timeframe: TimeFrame, interval: number = DEFAULT_INTERVAL) => {
  return [...Array(24).keys()].filter((t) => timeframe.EarliestStartTime <= t * interval && timeframe.LatestEndTime >= t * interval + interval);
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

const generateTimeframe = (venues: { [id: string]: VenueSession }): TimeFrame => {
  return Object.values(venues).reduce((acc, { EarliestStartTime, LatestEndTime }) => {
    return {
      ...acc,
      EarliestStartTime: EarliestStartTime < acc.EarliestStartTime ? EarliestStartTime : acc.EarliestStartTime,
      LatestEndTime: LatestEndTime > acc.LatestEndTime ? LatestEndTime : acc.LatestEndTime
    }
  }, DEFAULT_TIME_FRAME);
}


export const generateData = (venues: { [id: string]: VenueSession }, idList: ClubSparkId[]): { list: ExtendedSession[], totalAvailableCount: number } => {
  const venuesEntries = Object.entries(venues);
  const simpleSessions: { [id: string]: SimpleSession[][] } = venuesEntries.reduce((acc, [id, v]) => {
    const venueIndex = idList.findIndex((value) => value.id === id);
    const allSessions = v.Resources.map(({ ID, Name, Days }) => {
      const day = Days[0];
      return day.Sessions.map((s) => {
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
  const found = venuesEntries.find(([_name, entry]) => !!entry.Resources[0]);
  const resource = found ? found[1].Resources[0] : { Days: [{ Date: "" }] };
  const loadedDate = resource.Days[0].Date.split("T")[0];
  const timeframe = generateTimeframe(venues);
  let totalAvailableCount = 0;
  return {
    list: generateList(timeframe).map((hour) => {
      const session = generateSession(hour, simpleSessions, loadedDate);
      if (!session.isHistorical) {
        totalAvailableCount += session.availableCount;
      }
      return session;
    }),
    totalAvailableCount
  }
};