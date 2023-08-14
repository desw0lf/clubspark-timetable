import { cn as classNames } from "@/lib/utils";
import { generateDates } from "@/utils/generate-dates";
import history from "../../history";

const dates = generateDates(new Date(), 13);

interface MiniCalendarProps {
  date: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ date }) => {
  const changeDate = (dateStr: string) => () => {
    history.replace({ search: `?date=${dateStr}`});
    window.dispatchEvent(new Event("popstate"));
  };
  return (
    <div className="rdp" style={{ marginTop: "-1.3rem" }}>
      <table className="w-full border-collapse space-y-1" role="grid" aria-labelledby="day-picker">
        <thead className="rdp-head">
          <tr className="flex">
            {dates.map(([day, d]) => <th key={d} scope="col" className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label={day}>{day.slice(0, 2)}</th>)}
          </tr>
        </thead>
        <tbody className="rdp-tbody" role="rowgroup">
          <tr className="flex w-full mt-2">
            {dates.map(([_day, d]) => {
              const isActive = date === d;
              return <td key={d} className="text-center text-sm p-0 relative [&amp;:has([aria-selected])]:bg-accent first:[&amp;:has([aria-selected])]:rounded-l-md last:[&amp;:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20" role="presentation">
                <button onClick={changeDate(d)} aria-selected={isActive || undefined} tabIndex={isActive ? 0 : -1} className={classNames("rdp-button_reset rdp-button inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100", { "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground": isActive })} name="day" role="gridcell" type="button">
                  {d.slice(-2)}
                </button>
              </td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}