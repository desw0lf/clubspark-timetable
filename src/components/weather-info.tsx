import { Rain } from "./rain";
import { Waves } from "./waves";
import { OpacityIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// ? TYPES:
import { RainInfo } from "@/types/weather";

// https://docs.tomorrow.io/reference/weather-data-layers#field-descriptors
// "precipitationIntensity": "mm/hr", // Precipitation 50mm/hr
// "precipitationProbability": "%", // Probability 5% OR Chance of ${NAME} 5%

export const WeatherInfo: React.FC<{ info?: Partial<RainInfo> }> = ({ info = {} }) => {
  if (!info.visible) {
    return null;
  }
  return <>
    <Rain info={info as RainInfo} />
    <Waves intensity={info.intensity!} />
    <div>
      <div className="text-xs flex items-center justify-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{info.probability}%</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>Chance of {info.name}</p>
          </TooltipContent>
        </Tooltip>
        <OpacityIcon className="inline-block mt-px" />
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{info.intensity}mm/hr</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>{info.readableIntensity} Precipitation</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div >
  </>;
}