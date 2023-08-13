import { cn as classNames } from "@/lib/utils";
import { generateDates } from "@/utils/generate-dates";

const dates = generateDates(new Date(), 14);

interface MiniCalendarProps {
  startDate: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ startDate }) => {
  console.log({dates});
  return (
    <div className="rdp" style={{ marginTop: "-1.3rem" }}>
      <table className="w-full border-collapse space-y-1" role="grid" aria-labelledby="day-picker">
        <thead className="rdp-head">
          <tr className="flex">
            {dates.map(([day, date]) => <th key={date} scope="col" className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label={day}>{day.slice(0, 2)}</th>)}
          </tr>
        </thead>
        <tbody className="rdp-tbody" role="rowgroup">
          <tr className="flex w-full mt-2">
            {dates.map(([_day, date]) => {
              const isActive = startDate === date;
              return <td key={date} className="text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20" role="presentation">
                <button aria-selected={isActive} tabIndex={isActive ? 0 : -1} className={classNames("rdp-button_reset rdp-button inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100", { "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground bg-accent text-accent-foreground": isActive })} name="day" role="gridcell" type="button">
                  {date.slice(-2)}
                </button>
              </td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}