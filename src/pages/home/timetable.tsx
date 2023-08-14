import { useReducer, useMemo } from "react";
import { TimetableHeader } from "./timetable-header";
import { useQueries } from "react-query"
import { cn as classNames } from "@/lib/utils";
import homeService from "./home.service";
import { reducer, initialState } from "./reducer";
import { generateData } from "./reducer/generate-data";
import { ClockIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "@/hooks/use-search-params";
import { generateDate } from "@/utils/generate-dates";

const MAX_COLSPAN = 7; // remember to add to tailwind.config.js > safelist (if changed)

export function TimeTable() {
  const { date } = useSearchParams({ date: generateDate(new Date()) });
  const [{ idList, onlyAvailables }, dispatch] = useReducer(reducer, initialState);
  const sessions = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["sessions", id, date],
      queryFn: async () => homeService.getVenueSessions({ id, startDate: date, endDate: date }),
    })),
  );
  const { isAnyError, isAnyLoading } = useMemo(() => ({
    isAnyError: sessions.some((s) => s.isError),
    isAnyLoading: sessions.some((s) => s.isLoading)
  }), [sessions]);
  const list = useMemo(() => {
    if (sessions.every((s) => !!s.data)) {
      return generateData(idList.reduce((acc, item, i) => ({
        ...acc,
        [item.id]: sessions[i].data
      }), {}));
    }
    return [];
  }, [idList, sessions]);
  const getUrl = (id: string, date: string) => `${import.meta.env.VITE_BASE_EXTERNAL_URL}/${id}/Booking/BookByDate#?date=${date}&role=guest`;
  const toggleAvailables = () => dispatch({ type: "TOGGLE_ONLY_AVAILABLES" });
  console.log({ list });
  if (isAnyError) {
    return <>Errored</>;
  }
  if (isAnyLoading) {
    return <>
      <TimetableHeader onlyAvailables={onlyAvailables} onToggleAvailables={toggleAvailables} date={date} />
      <span>Loading...</span>
    </>;
  }
  const colspan = MAX_COLSPAN - idList.length;
  return (
    <>
      <TimetableHeader onlyAvailables={onlyAvailables} onToggleAvailables={toggleAvailables} date={date} />
      <div className={classNames("grid gap-2 sticky top-14 bg-background/95 py-4", { [`grid-cols-${MAX_COLSPAN}`]: true })}>
        <div className={classNames({ [`col-span-${colspan}`]: true })}></div>
        {idList.map(({ id, friendlyName }) => {
          return <div key={id} className="col-span-1">
            <a href={getUrl(id, date)} target="_blank" className="font-medium text-muted-foreground inline-flex items-center gap-1 transition-colors  hover:text-foreground">
              <span>{friendlyName || id}</span>
              <ExternalLinkIcon />
            </a>
          </div>;
        })}
      </div>
      {list.map((item) => {
        const areAnyAvailable = item.availableCount > 0;
        if (onlyAvailables && !areAnyAvailable) {
          return <hr key={item.startTime} className="opacity-25" />;
        }
        return <div key={item.startTime} className={classNames("grid gap-2", { [`grid-cols-${MAX_COLSPAN}`]: true })}>
          <div className={classNames("border bg-card text-card-foreground shadow", { [`col-span-${colspan}`]: true })}>
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium inline-flex items-center gap-1">
                <ClockIcon />
                <span className={classNames({ "text-lime-600": item.available })}>{item.readableStartTime} - {item.readableEndTime}</span>
              </h3>
              {/* <EyeOpenIcon className="text-muted-foreground" /> */}
            </div>
            <div className="p-6 pt-0">
              {/* <div className="text-2xl font-bold">big_title</div> */}
              <p className="text-xs text-muted-foreground">{areAnyAvailable ? `${item.availableCount} court(s) available` : "Unavailable"}</p>
            </div>
          </div>
          {Object.entries(item.bases).map(([_id, arr], i) => {
            return <div key={i} className="flex flex-col justify-evenly border bg-card text-card-foreground shadow col-span-1 px-2">
              {arr.map((b, j) => {
                if (!b) {
                  return null;
                }
                const isAvailable = typeof b.Cost === "number";
                return <div key={j} className={classNames({ "text-lime-600": isAvailable, "text-muted-foreground": !isAvailable, "invisible": onlyAvailables && !isAvailable })}>
                  <div className="tracking-tight text-sm font-medium">{b.resourceMeta.Name} {isAvailable && <span className="float-right">&pound;{b.Cost}</span>}</div>
                  <p className="text-xs text-muted-foreground">{b.Name}</p>
                </div>;
              })}
            </div>;
          })}
        </div>;
      })}
    </>
  )
}