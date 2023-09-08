import { useEffect, useCallback, useState } from "react";
import { availableDates } from "@/pages/home/consts";
import { decodeParams } from "@/utils/params";

function paramParser(defaultValue: { [key: string]: string }) {
  const searchParams = decodeParams(window.location.search, defaultValue);
  if (!availableDates.map(([_day, d]) => d).includes(searchParams.date)) {
    searchParams["date"] = defaultValue.date;
  }
  return searchParams;
}

export function useSearchParams(defaultValue: { [key: string]: string } = {}) {
  const [searchParams, setSearchParams] = useState(() => paramParser(defaultValue));
  const handlePopStateChange = useCallback((_event) => {
    setSearchParams(paramParser(defaultValue));
  }, [defaultValue]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopStateChange);
    return () => {
      window.removeEventListener("popstate", handlePopStateChange);
    };
  }, [handlePopStateChange]);

  return searchParams;
}