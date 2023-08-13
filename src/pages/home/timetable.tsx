import { useReducer, useMemo } from "react";
import { useQueries } from "react-query"
import classNames from "classnames";
import homeService from "./home.service";
import { reducer, initialState } from "./reducer";
import { generateData } from "./reducer/generate-data";
import { ClockIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

const MAX_COLSPAN = 7;

export function TimeTable() {
  const [{ searchParams: { startDate, endDate }, idList, onlyAvailables }] = useReducer(reducer, initialState);
  const sessions = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["sessions", id, startDate, endDate],
      queryFn: async () => homeService.getVenueSessions({ id, startDate, endDate }),
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
  console.log({list});
  if (isAnyError) {
    return <>Errored</>;
  }
  if (isAnyLoading) {
    return <>Loading...</>
  }
  const colspan = MAX_COLSPAN - idList.length;
  return (
    <>
      <div className={`grid gap-2 grid-cols-${MAX_COLSPAN} sticky top-14 bg-background/95 py-4`}>
        <div className={`col-span-${colspan}`}></div>
        {idList.map(({ id, friendlyName }) => {
          return <div key={id} className="col-span-1">
            <a href={getUrl(id, startDate)} target="_blank" className="font-medium text-muted-foreground inline-flex items-center gap-1 transition-colors  hover:text-foreground">
              <span>{friendlyName || id}</span>
              <ExternalLinkIcon />
            </a>
          </div>;
        })}
      </div>
      {list.map((item) => {
        const areAnyAvailable = item.availableCount > 0;
        if (onlyAvailables && !areAnyAvailable) {
          return null;
        }
        return <div key={item.startTime} className={`grid gap-2 grid-cols-${MAX_COLSPAN}`}>
        <div className={`border bg-card text-card-foreground shadow col-span-${colspan}`}>
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
          return <div key={i} className="border bg-card text-card-foreground shadow col-span-1">
            {arr.map((b, j) => {
              if (!b) {
                return null;
              }
              const isAvailable = typeof b.Cost === "number";
              return <div key={j} className={classNames({ "text-lime-600": isAvailable })}>
                <div>{b.Name}</div>
                <div>{b.resourceMeta.Name} {isAvailable && <span>- &pound;{b.Cost}</span>}</div>
              </div>;
            })}
            </div>;
        })}
      </div>;
      })}
    </>
  )
}