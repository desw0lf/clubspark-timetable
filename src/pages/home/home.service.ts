import api from "../../api";
// ? TYPES:
import { VenueSession } from "../../types/venue-session";
import { DateString } from "../../types/global";

const getVenueSessions = async ({ id, startDate, endDate }: { id: string; startDate: DateString; endDate: DateString; }) => {
  const search = {
    startDate,
    endDate,
    _: Date.now()
  };
  return await api.query(search).get(`/v0/VenueBooking/${id}/GetVenueSessions`) as VenueSession;
}

export default { getVenueSessions };