interface WeatherInterval {
  startTime: string; //"2023-09-04T00:00:00+01:00"
  values: {
    freezingRainIntensity: number;
    precipitationProbability: number;
    rainIntensity: number;
    sleetIntensity: number;
    snowIntensity: number;
    precipitationType: 0 | 1 | 2 | 3 | 4;
  }
}

export interface WeatherResponse {
  data: {
    timelines: [
      {
        startTime: string; // "2023-09-04T00:00:00+01:00";
        endTime: string; // "2023-09-05T00:00:00+01:00";
        intervals: WeatherInterval[];
        timestep: "1h" | string;
      }
    ]
  }
}

export interface RainInfo {
  name: string;
  intensity: number;
  readableIntensity: string;
  probability: number;
  visible?: boolean;
}