import { addLeadingZero } from "./add-leading-zero";
// ? TYPES:
import { IntTime } from "../types/global";

function toHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export function intTimeToStr(intTime: IntTime) {
  const { hours, minutes } = toHoursAndMinutes(intTime);
  return `${addLeadingZero(hours.toString())}:${addLeadingZero(minutes.toString())}`;
}