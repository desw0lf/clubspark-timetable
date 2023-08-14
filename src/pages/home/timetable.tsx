import { useReducer, useMemo } from "react";
import { TimetableHeader } from "./timetable-header";
import { useQueries } from "react-query"
import { cn as classNames } from "@/lib/utils";
import homeService from "./home.service";
import { reducer, initialState } from "./reducer";
import { generateData } from "./reducer/generate-data";
import { ClockIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "@/hooks/use-search-params";
import { generateDate } from "@/utils/generate-dates";
import { useIdList } from "@/providers/id-list-provider";
import { TimetableTh } from "./timetable-th";
// ? TYPES:
import { Settings } from "@/types/settings";

export function TimeTable() {
  const { idList } = useIdList();
  const { date } = useSearchParams({ date: generateDate(new Date()) });
  const [{ onlyAvailables }, dispatch] = useReducer(reducer, initialState);
  const sessions = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["sessions", id, date],
      queryFn: async () => homeService.getVenueSessions({ id, startDate: date, endDate: date }),
    })),
  );
  const settings = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["settings", id],
      queryFn: async () => homeService.getSettings({ id }),
      initialData: { Roles: [{ AdvancedBookingPeriod: -1 }] } as unknown as Settings
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
  const toggleAvailables = () => dispatch({ type: "TOGGLE_ONLY_AVAILABLES" });
  console.log({ list });
  if (isAnyError) {
    return <div>Errored</div>;
  }
  if (isAnyLoading) {
    return <>
      <TimetableHeader onlyAvailables={onlyAvailables} onToggleAvailables={toggleAvailables} date={date} settings={settings} />
      <div className="flex flex-col gap-2">
        <TimetableTh date={date} />
        <div>Loading...</div>
      </div>
    </>;
  }
  return (
    <>
      <TimetableHeader onlyAvailables={onlyAvailables} onToggleAvailables={toggleAvailables} date={date} settings={settings} />
      <div className="flex flex-col gap-2">
        <TimetableTh date={date} />
        {list.map((item) => {
          const areAnyAvailable = item.availableCount > 0;
          if (onlyAvailables && !areAnyAvailable) {
            return <hr key={item.startTime} className="opacity-25" />;
          }
          return <div key={item.startTime} className="flex gap-2">
            <div className="border bg-card text-card-foreground shadow grow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium inline-flex items-center gap-1">
                  <ClockIcon />
                  <span>{item.readableStartTime} - {item.readableEndTime}</span>
                </h3>
                {/* <EyeOpenIcon className="text-muted-foreground" /> */}
              </div>
              <div className="p-6 pt-0">
                {/* <div className="text-2xl font-bold">big_title</div> */}
                <p className="text-xs text-muted-foreground">{areAnyAvailable ? `${item.availableCount} court(s) available` : "Unavailable"}</p>
              </div>
            </div>
            {Object.entries(item.bases).map(([_id, arr], i) => {
              return <div key={i} className="flex flex-col justify-evenly border bg-card text-card-foreground shadow basis-44 px-2">
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
      </div>
    </>
  )
}