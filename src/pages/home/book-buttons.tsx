import { OpenInNewWindowIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// ? TYPES:
import { Interval } from "@/types/venue-session";
import { IntTime } from "@/types/global";




export const BookButtons: React.FC<{ intervals: Interval[], generateUrl: (interval: IntTime) => string, disabled: boolean }> = ({ intervals, generateUrl, disabled }) => {
  const btnVariant = buttonVariants({ variant: "secondary", className: "h-full text-xs !px-1 sm:!px-2 font-normal" });
  if (intervals.length === 1) {
    return <a aria-disabled={disabled} className={btnVariant} href={generateUrl(intervals[0].interval)} rel="noopener noreferrer" target="_blank">Book <OpenInNewWindowIcon className="ml-0.5" /></a>;
  }
  return <DropdownMenu>
    <DropdownMenuTrigger disabled={disabled} className={btnVariant}>Book <ChevronDownIcon className="ml-0.5" /></DropdownMenuTrigger>
    <DropdownMenuContent>
      {intervals.map((int) => <DropdownMenuItem key={int.interval} asChild>
        <a className="flex justify-between !cursor-pointer" href={generateUrl(int.interval)} rel="noopener noreferrer" target="_blank">
          <span className="text-xs">{int.readableStartTime} - {int.readableEndTime}</span>
          <OpenInNewWindowIcon />
        </a>
      </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>;
}