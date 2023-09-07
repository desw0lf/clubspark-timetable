import { useMemo } from "react";
import { useQueries, UseQueryOptions } from "react-query";
import { useIdList } from "@/providers/id-list-provider";
import placesService from "@/services/places.service";
import weatherService from "@/services/weather.service";
import { intTimeToStr } from "@/utils/int-time-to-str";
import { toUtcIso, addDays } from "@/utils/date";
// ? TYPES:
import { Location } from "@/types/location";
import { WeatherResponse, RainInfo } from "@/types/weather";
// function generateEndTime(startTime: string) {
//   const d = new Date(startTime);
//   d.setUTCDate(d.getUTCDate() + 1);
//   return toIso(d);
// }

const PRECIPITATION_TYPE = {
  // 0: "N/A",
  1: "rainIntensity",
  2: "snowIntensity",
  3: "freezingRainIntensity",
  4: "sleetIntensity"
} as const;

const PRECIPITATION_NAME = {
  0: "N/A",
  1: "Rain",
  2: "Snow",
  3: "Freezing Rain",
  4: "Ice Pellets"
} as const;

const PLACEHOLDER_RESPONSE = {
  data: {
    timelines: [{
      startTime: "",
      endTime: "",
      intervals: [],
      timestep: "1h"
    }]
  }
};

function generateReadableStartTime(isoDate: string) {
  const dateObj = new Date(isoDate);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return intTimeToStr(hours * 60 + minutes);
}

function getReadableIntensity(intensity: number) {
  if (intensity >= 7.6) {
    return "High";
  }
  if (intensity <= 2.5) {
    return "Low";
  }
  return "Moderate";
}

export function useGetWeather(startTime: string, enabled?: boolean) {
  const { idList } = useIdList();
  const locations = useQueries(
    idList.map<UseQueryOptions<any, unknown, { id: string; loc: undefined | Location }>>(({ id }) => ({
      enabled: enabled,
      queryKey: ["locations", id],
      queryFn: async () => placesService.getFindPlaceFromText({ input: id }),
      retry: 0,
      // placeholderData: { id, loc: undefined as undefined | Location },
      initialData: { id, loc: undefined as undefined | Location },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
      select: (data) => {
        if (!data.candidates) {
          return data;
        }
        const candidate = data.candidates[0] || { geometry: { location: undefined } };
        const loc = candidate.geometry.location;
        return { id, loc };
      }
    }))
  )
  const forecasts = useQueries(
    locations.map<UseQueryOptions<any, unknown, { id: string; data: WeatherResponse["data"] }>>(({ data }) => ({
      enabled: !!data!.loc && enabled,
      queryKey: ["forecast", data!.id, startTime],
      queryFn: async () => weatherService.getTimelines({ location: `${data!.loc!.lat},${data!.loc!.lng}`, startTime: toUtcIso(new Date(startTime)), endTime: toUtcIso(addDays(new Date(startTime), 1)) }),
      retry: 0,
      placeholderData: PLACEHOLDER_RESPONSE,
      initialData: PLACEHOLDER_RESPONSE,
      refetchOnWindowFocus: false,
      select: (response) => {
        return { ...response, id: data!.id };
      }
    })),
  );
  const intervals = useMemo(() => {
    return forecasts.map((curr) => {
      const item = curr.data!;
      const intervals = item.data.timelines[0].intervals;
      const lastIndex = intervals.length - 1;
      const newIntervals: { [startTime: string]: RainInfo } = intervals.reduce((acc, { values, startTime }, i) => {
        if (i === lastIndex) {
          return acc;
        }
        const type = values.precipitationType;
        const probability = values.precipitationProbability;
        const intensity = type === 0 ? 0 : values[PRECIPITATION_TYPE[type]];
        return {
          ...acc,
          [generateReadableStartTime(startTime)]: {
            name: PRECIPITATION_NAME[type],
            intensity,
            probability,
            readableIntensity: getReadableIntensity(intensity),
            visible: probability > 0 ? true : false,
          }
        }
      }, {});
      // newIntervals.pop();
      return newIntervals;
    });
  }, [forecasts]);
  return intervals;
}