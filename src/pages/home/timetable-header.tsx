import { MiniCalendar } from "./mini-calendar";
// import { CalendarIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TimetableHeaderProps {
  onlyAvailables: boolean;
  onToggleAvailables: (checked?: boolean) => void;
  date: string;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ onlyAvailables, onToggleAvailables, date }) => {
  return <div className="flex items-center justify-between space-y-2">
    <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>
    <div className="flex items-center space-x-8">
      <div className="inline-flex items-center justify-center space-x-2">
        <Switch checked={onlyAvailables} onCheckedChange={onToggleAvailables} id="onlyAvailables" />
        <Label htmlFor="onlyAvailables">Available Only</Label>
      </div>
      <div>
        <MiniCalendar date={date} />
      </div>
    </div>
  </div>;
}