import { MiniCalendar } from "./mini-calendar";
// import { CalendarIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// ? TYPES:
import { Settings } from "@/types/settings";
import { UseQueryResult } from "react-query/types/react/types";

interface TimetableHeaderProps {
  onlyAvailables: boolean;
  onToggleAvailables: (checked?: boolean) => void;
  date: string;
  settings: UseQueryResult<Settings, unknown>[];
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ onlyAvailables, onToggleAvailables, date, settings }) => {
  return <div className="flex items-center justify-between space-y-2 flex-col lg:flex-row">
    <div>
      <h2 className="text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">Timetable</h2>
      <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">Booking availability for provided venues</span>
    </div>
    <div className="flex items-center gap-8 flex-col-reverse lg:flex-row">
      <div className="inline-flex items-center justify-center space-x-2">
        <Switch checked={onlyAvailables} onCheckedChange={onToggleAvailables} id="onlyAvailables" />
        <Label htmlFor="onlyAvailables">Bookable only</Label>
      </div>
      <div className="mt-12 lg:mt-0">
        <MiniCalendar date={date} settings={settings} />
      </div>
    </div>
  </div>;
}