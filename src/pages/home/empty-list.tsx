import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdList } from "@/providers/id-list-provider";
import { cn as classNames } from "@/lib/utils";
// import { ClockIcon } from "@radix-ui/react-icons";

export const EmptyList: React.FC<{ onlyAvailables: boolean }> = ({ onlyAvailables }) => {
  const { idList } = useIdList();
  const list = useMemo(() => ([...Array(10).keys()].map((item) => ({
    id: item,
    bases: idList.map(({ id }) => ({ id, courts: [1, 2].map(() => !onlyAvailables ? true : Math.random() < 0.5) }))
  }))), [onlyAvailables, idList]);
  return list.map((item) => {
    return <div key={item.id} className="flex gap-px sm:gap-2">
      <div className="border bg-card text-card-foreground shadow grow">
        <div className="sm:p-6 px-1 flex flex-row items-center justify-between space-y-0 sm:pb-2">
          <Skeleton className="h-10 sm:h-5 w-[48px] sm:w-[98px]" />
          {/* <h3 className="tracking-tight text-sm font-medium inline-flex items-center gap-1 text-muted-foreground">
            <ClockIcon />
            <span>{item.readableStartTime} - {item.readableEndTime}</span>
          </h3> */}
        </div>
        <div className="sm:p-6 px-1 sm:pt-0 pt-px">
          <Skeleton className="h-4 sm:w-[100px]" />
          {/* <p className="text-xs text-muted-foreground">X court(s) available</p> */}
        </div>
      </div>
      {item.bases.map((a) => <div key={a.id} className="flex flex-col justify-evenly border bg-card text-card-foreground shadow basis-44 py-px px-px sm:px-2">
        {a.courts.map((c, i) => {
          return <div key={i} className={classNames({ "invisible": !c })}>
            <div className="tracking-tight text-xs sm:text-sm font-medium flex justify-between items-start h-5 mt-px sm:mt-0">
              <Skeleton className="h-full w-[52px] sm:w-[62px]" />
            </div>
            <Skeleton className="h-4 w-[28px] sm:w-[30px] mt-1" />
          </div>
        })}
      </div>)}
    </div>
  })
}