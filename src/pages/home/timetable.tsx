import { useReducer, useMemo } from "react";
import { TimetableHeader } from "./timetable-header";
import { useQueries } from "react-query";
import { cn as classNames } from "@/lib/utils";
import venueBookingService from "../../services/venue-booking.service";
import { reducer, initialState } from "./reducer";
import { generateData } from "./reducer/generate-data";
import { EmptyList } from "./empty-list";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "@/hooks/use-search-params";
import { generateDate } from "@/utils/generate-dates";
import { useIdList } from "@/providers/id-list-provider";
import { TimetableTh } from "./timetable-th";
import { generateBookingUrl } from "@/ext-urls";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BookButtons } from "./book-buttons";
// ? TYPES:
import { Settings } from "@/types/settings";
import { ExtendedSession } from "@/types/venue-session";
import { IntTime } from "@/types/global";

const TodayLine: React.FC<{ top?: string }> = ({ top }) => <hr className={classNames("-mx-6 border-2 border-sky-600 opacity-30 pointer-events-none", { "absolute inset-x-0": top })} style={{ top }} />

export function TimeTable() {
  const { idList } = useIdList();
  const { date } = useSearchParams({ date: generateDate(new Date()) });
  const [{ onlyAvailables }, dispatch] = useReducer(reducer, initialState);
  const sessions = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["sessions", id, date],
      queryFn: async () => venueBookingService.getVenueSessions({ id, startDate: date, endDate: date }),
    })),
  );
  const settings = useQueries(
    idList.map(({ id }) => ({
      queryKey: ["settings", id],
      queryFn: async () => venueBookingService.getSettings({ id }),
      initialData: { Roles: [{ AdvancedBookingPeriod: -1, MaximumBookingIntervals: 2, VenueID: "#errored" }] } as unknown as Settings,
      keepPreviousData: true
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
      }), {}), idList);
    }
    return [];
  }, [idList, sessions]);
  const toggleAvailables = () => dispatch({ type: "TOGGLE_ONLY_AVAILABLES" });
  const getVenueId = (i: number) => settings[i].data!.VenueID;
  const generateUrl = (id: string, date: string, extendedSession: ExtendedSession, sessionIndex: number) => (interval: IntTime) => {
    const { Category, SubCategory, resourceMeta, ID } = extendedSession.bases[id][sessionIndex];
    const VenueID = getVenueId(resourceMeta.venueIndex);
    const params = {
      Date: date,
      ResourceID: resourceMeta.ID,
      SessionID: ID,
      Category,
      SubCategory,
      VenueID,
      StartTime: extendedSession.startTime,
      EndTime: extendedSession.startTime + interval,
    };
    return generateBookingUrl(id, params);
  };

  if (isAnyError) {
    return <div>Errored</div>;
  }
  if (isAnyLoading) {
    return <>
      <TimetableHeader onlyAvailables={onlyAvailables} onToggleAvailables={toggleAvailables} date={date} settings={settings} />
      <div className="flex flex-col gap-2">
        <TimetableTh date={date} />
        <EmptyList onlyAvailables={onlyAvailables} />
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
            return item.percentageOfTimePassedInSlot >= 0 ? <TodayLine /> : <hr key={item.startTime} className="opacity-25" />;
          }
          return <div key={item.startTime} className={classNames("flex gap-px sm:gap-2 relative", { "opacity-20": item.isHistorical })}>
            {item.percentageOfTimePassedInSlot >= 0 && <TodayLine top={`${item.percentageOfTimePassedInSlot}%`} />}
            <div className="border bg-card text-card-foreground shadow grow">
              <div className="sm:p-6 px-1 flex flex-row items-center justify-between space-y-0 sm:pb-2">
                <h3 className="tracking-tight text-sm font-medium inline-flex items-center gap-px sm:gap-1">
                  <ClockIcon />
                  <span><span className="block sm:inline">{item.readableStartTime}</span><span className="hidden sm:inline"> - </span><span className="block sm:inline">{item.readableEndTime}</span></span>
                </h3>
                {/* <EyeOpenIcon className="text-muted-foreground" /> */}
              </div>
              <div className="sm:p-6 px-1 sm:pt-0 pt-0">
                {/* <div className="text-2xl font-bold">big_title</div> */}
                <p className="text-xs text-muted-foreground">{areAnyAvailable ? `${item.availableCount} court(s) available` : "Unavailable"}</p>
              </div>
            </div>
            {Object.entries(item.bases).map(([id, arr], i) => {
              return <div key={i} className="flex flex-col justify-evenly border bg-card text-card-foreground shadow basis-44 py-px px-px sm:px-2">
                {arr.map((b, j) => {
                  if (!b) {
                    return null;
                  }
                  const isAvailable = typeof b.Cost === "number";
                  const venueIndex = b.resourceMeta.venueIndex;
                  const MaximumBookingIntervals = settings[venueIndex].data!.Roles[0].MaximumBookingIntervals;
                  return <div key={j} className={classNames("text-muted-foreground", { "invisible": onlyAvailables && !isAvailable })}>
                    <div className="tracking-tight text-xs sm:text-sm font-medium flex justify-between items-start h-5">
                      <span className="inline-flex items-center gap-px sm:gap-1">
                        <span className={classNames({ "text-lime-600": isAvailable })}>{b.resourceMeta.Name}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircledIcon />
                          </TooltipTrigger>
                          <TooltipContent asChild>
                            <span>{b.Name}</span>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      {isAvailable && <BookButtons disabled={item.isHistorical} intervals={b.intervals.slice(0, MaximumBookingIntervals)} generateUrl={generateUrl(id, date, item, j)} />}
                    </div>
                    <p className="text-xs text-muted-foreground">{isAvailable ? <span>{b.readableCost}</span> : <span className="opacity-25">-</span>}</p>
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
