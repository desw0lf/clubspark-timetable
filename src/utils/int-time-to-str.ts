import { IntTime } from "../types/global";

export function intTimeToStr(intTime: IntTime) {
  const hour = intTime / 60;
  return `${hour.toString().padStart(2, "0")}:00`;
}