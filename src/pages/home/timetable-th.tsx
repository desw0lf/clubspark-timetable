import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Pointer } from "@/components/pointer";
import { useIdList } from "@/providers/id-list-provider";

interface TimetableThProps {
  date: string;
}

export const TimetableTh: React.FC<TimetableThProps> = ({ date }) => {
  const { idList } = useIdList();
  const getUrl = (id: string, date: string) => `${import.meta.env.VITE_BASE_EXTERNAL_URL}/${id}/Booking/BookByDate#?date=${date}&role=guest`;
  return <div className="flex gap-2 sticky top-14 bg-background/95 py-4">
    <div className="grow"></div>
    {idList.map(({ id, friendlyName }, i) => {
      return <div key={id} className="basis-44">
        <a href={getUrl(id, date)} target="_blank" className="font-medium text-muted-foreground inline-flex items-center gap-1 transition-colors  hover:text-foreground">
          <Pointer pointer={{ friendlyName: "", index: i }} />
          <span>{friendlyName || id}</span>
          <ExternalLinkIcon />
        </a>
      </div>;
    })}
  </div>;
}