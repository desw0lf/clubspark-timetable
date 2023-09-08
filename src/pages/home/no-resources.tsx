import GrandSlamSVG from "../../assets/undraw_grand_slam_84ep.svg";

function getReadableDate(date: string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: undefined, numberingSystem: "traditio" }).format(d);
}

export const NoResources: React.FC<{ date: string }> = ({ date }) => (<div className="pt-4 md:pt-20">
  <div className="relative flex gap-2 md:gap-24 justify-center flex-row items-center w-full [&>svg]:max-w-full [&>svg]:md:max-w-xs">
    <div style={{ maxWidth: "560px" }}>
      <span className="inline-flex items-center rounded-sm md:rounded-lg bg-muted px-1 md:px-3 py-1 md:py-1 text-[11px] md:text-sm font-medium mb-2">
        {getReadableDate(date)}
      </span>
      <p className="font-semibold tracking-tight text-1xl md:text-6xl">
        All available courts are currently booked
      </p>
      <p className="mt-1 md:mt-4 text-muted-foreground text-xs md:text-lg">
        Please check back later for updates on court availability, or explore other nearby venues for your requirements.
      </p>
    </div>
    <GrandSlamSVG />
  </div>
  <hr className="border-2 -mt-2 self-stretch z-[-1]" style={{ borderColor: "rgb(63, 61, 86)" }} />
</div>);