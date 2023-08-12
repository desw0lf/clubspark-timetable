import { useEffect, useReducer, useMemo } from "react";
import { useQueries } from "react-query"
import homeService from "./home.service";
import { reducer, initialState } from "./reducer";

export function TimeTable() {
  const [{ searchParams: { startDate, endDate }, idList }, dispatch] = useReducer(reducer, initialState);
  const sessions = useQueries(
    idList.map((id) => ({
      queryKey: ["sessions", id, startDate, endDate],
      queryFn: async () => homeService.getVenueSessions({ id, startDate, endDate })
    })),
  );
  const { isAnyError, isAnyLoading } = useMemo(() => ({
    isAnyError: sessions.some((s) => s.isError),
    isAnyLoading: sessions.some((s) => s.isLoading)
  }), [sessions]);
  useEffect(() => {
    if (!isAnyLoading) {
      dispatch({ type: "GENERATE_DATA", sessions });
    }
  }, [dispatch, sessions, isAnyLoading]);
  
  if (isAnyError) {
    return <>Errored</>;
  }
  if (isAnyLoading) {
    return <>Loading...</>
  }
  return (
    <>
      data loaded
    </>
  )
}