import { cn as classNames } from "@/lib/utils";
const colours = ["#C2095A", "#FEB95F", "#629677", "#FEEA00", "#D6FF79", "#5F00BA", "#3F612D", "#F71735"];

export const Pointer: React.FC<{
  className?: string;
  pointer: {
    friendlyName?: string;
    index: number;
  }
}> = ({ pointer, className }) => {
  if (!pointer) {
    return null;
  }
  return <span className={classNames("w-2 h-2 rounded-full", className)} style={{ backgroundColor: colours[pointer.index] || colours[0] }}></span>;
}