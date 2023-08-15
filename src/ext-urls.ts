import { BASE_EXTERNAL_URL } from "@/config";
import { generateParams } from "@/utils/params";
// ? TYPES:
import { IntTime } from "./types/global";

export const generateTimetableUrl = (id: string, date: string) => `${BASE_EXTERNAL_URL}/${id}/Booking/BookByDate#${generateParams({ date, role: "guest" })}`;

export const generateBookingUrl = (id: string, params: { Date: string; ResourceID: string; SessionID: string; Category: number; SubCategory: number; VenueID: string; StartTime: IntTime; EndTime: IntTime }) => {
  return `${BASE_EXTERNAL_URL}/${id}/Booking/Book${generateParams(params)}`;
};