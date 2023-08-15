import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Pointer } from "@/components/pointer";
import { useIdList } from "@/providers/id-list-provider";
import { generateTimetableUrl } from "@/ext-urls";

interface TimetableThProps {
  date: string;
}

export const TimetableTh: React.FC<TimetableThProps> = ({ date }) => {
  const { idList } = useIdList();
  return <div className="flex gap-2 sticky top-14 bg-background/95 py-4">
    <div className="grow">
      <div className="px-6">
        <div className="w-full" style={{ maxWidth: "96px", minWidth: "65px" }}></div>
      </div>
    </div>
    {idList.map(({ id, friendlyName }, i) => {
      return <div key={id} className="basis-44">
        <a href={generateTimetableUrl(id, date)} target="_blank" rel="noopener noreferrer" className="font-medium text-muted-foreground inline-flex items-center gap-1 transition-colors  hover:text-foreground">
          <Pointer pointer={{ friendlyName: "", index: i }} />
          <span>{friendlyName || id}</span>
          <ExternalLinkIcon />
        </a>
      </div>;
    })}
  </div>;
}