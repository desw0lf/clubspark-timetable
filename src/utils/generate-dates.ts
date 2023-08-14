import { addLeadingZero } from "./add-leading-zero";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const SHORT_DAYS = DAYS.map((d) => d.slice(0, 2));

export function generateDate(d: Date) {
  const month = d.getMonth() + 1;
  return `${d.getFullYear()}-${addLeadingZero(month.toString())}-${addLeadingZero(d.getDate().toString())}`;
}

export function generateDates(startDate: Date, daysToAdd: number) {
  const arrDates: [string, string][] = [];

  for (let i = 0; i <= daysToAdd; i += 1) {
    const currentDate = new Date();
    currentDate.setDate(startDate.getDate() + i);
    const day = DAYS[currentDate.getDay()];
    arrDates.push([day, generateDate(currentDate)]);
  }

  return arrDates;
}