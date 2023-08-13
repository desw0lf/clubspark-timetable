import { addLeadingZero } from "./add-leading-zero";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const SHORT_DAYS = DAYS.map((d) => d.slice(0, 2));

export function generateDates(startDate: Date, daysToAdd: number) {
  const arrDates: [string, string][] = [];

  for (let i = 0; i <= daysToAdd; i += 1) {
    const currentDate = new Date();
    currentDate.setDate(startDate.getDate() + i);
    const day = DAYS[currentDate.getDay()];
    const month = currentDate.getMonth() + 1;
    arrDates.push([day, `${currentDate.getFullYear()}-${addLeadingZero(month.toString())}-${addLeadingZero(currentDate.getDate().toString())}`]);
  }

  return arrDates;
}