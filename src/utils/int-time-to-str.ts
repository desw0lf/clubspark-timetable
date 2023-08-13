import { addLeadingZero } from "./add-leading-zero";
// ? TYPES:
import { IntTime } from "../types/global";


export function intTimeToStr(intTime: IntTime) {
  const hour = intTime / 60;
  return `${addLeadingZero(hour.toString())}:00`;
}