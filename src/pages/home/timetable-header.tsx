import { forwardRef } from "react";
import { MiniCalendar } from "./mini-calendar";
import { cn as classNames } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from "@/components/ui/tooltip";
// ? TYPES:
import { Settings } from "@/types/settings";
import { UseQueryResult } from "react-query/types/react/types";

interface TimetableHeaderProps {
  onlyAvailables: boolean;
  onToggleAvailables: (checked?: boolean) => void;
  date: string;
  settings: UseQueryResult<Settings, unknown>[];
  rainForecast: boolean;
  onToggleRainForecast: (checked?: boolean) => void;
  rainForecastDisabled: boolean;
}

const ForecastTooltip = forwardRef<HTMLSpanElement, { rainForecastDisabled: boolean }>(({ rainForecastDisabled }, ref) => {
  if (rainForecastDisabled) {
    return <span ref={ref}>Rain forecast available only <strong>{import.meta.env.VITE_WEATHER_FORECAST_DAYS}</strong> days ahead</span>;
  }
  return <span ref={ref}>Highlighted in the venues column when there's a chance of rain</span>;
});

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ onlyAvailables, onToggleAvailables, date, settings, rainForecast, onToggleRainForecast, rainForecastDisabled }) => {
  return <div className="flex items-center justify-between space-y-2 flex-col lg:flex-row">
    <div>
      <h2 className="text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">Timetable</h2>
      <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">Booking availability for provided venues</span>
    </div>
    <div className="flex items-center gap-8 flex-col-reverse lg:flex-row">
      <div className="flex flex-col gap-4 items-start">
        <div className="inline-flex items-center justify-center space-x-2">
          <Switch className="h-[16px] w-[36px]" thumbClassName="h-3 w-3" checked={onlyAvailables} onCheckedChange={onToggleAvailables} id="onlyAvailables" />
          <Label htmlFor="onlyAvailables">Bookable only</Label>
        </div>
        <div className="inline-flex items-center justify-center space-x-2">
          <Switch className="h-[16px] w-[36px]" thumbClassName="h-3 w-3" disabled={rainForecastDisabled} checked={rainForecast && !rainForecastDisabled} onCheckedChange={onToggleRainForecast} id="forecast" />
          <Label htmlFor="forecast">
            <span>Rainfall forecast</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircledIcon className={classNames("inline-block ml-1 -mb-0.5", { "text-orange-300": rainForecastDisabled })} />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="top">
                <ForecastTooltip rainForecastDisabled={rainForecastDisabled} />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </div>
      </div>
      <div className="mt-12 lg:mt-0">
        <MiniCalendar date={date} settings={settings} />
      </div>
    </div>
  </div>;
}