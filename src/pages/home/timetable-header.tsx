import { MiniCalendar } from "./mini-calendar";
// import { CalendarIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TimetableHeaderProps {
  onlyAvailables: boolean;
  onToggleAvailables: (checked?: boolean) => void;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ onlyAvailables, onToggleAvailables }) => {
  return <div className="flex items-center justify-between space-y-2">
    <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>
    <div className="flex items-center space-x-8">
      <div className="inline-flex items-center justify-center space-x-2">
        <Switch checked={onlyAvailables} onCheckedChange={onToggleAvailables} id="onlyAvailables" />
        <Label htmlFor="onlyAvailables">Available Only</Label>
      </div>
      <div>
        <MiniCalendar startDate={"2023-08-14"} />
      </div>
      {/* <div className="grid gap-2">
        <button className="gap-2 inline-flex items-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[260px] justify-start text-left font-normal" id="date" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R1j9mmkr9hja:" data-state="closed">
          <CalendarIcon /> Jan 20, 2023 - Feb 09, 2023
        </button>
      </div> */}
    {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">Download</button> */}
    </div>
  </div>;
}