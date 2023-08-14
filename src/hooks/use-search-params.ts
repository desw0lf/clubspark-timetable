import { useEffect, useCallback, useState } from "react";
import { decodeParams } from "@/utils/params";

export function useSearchParams(defaultValue = {}) {
  const [searchParams, setSearchParams] = useState(decodeParams(window.location.search, defaultValue));
  const handlePopStateChange = useCallback((_event) => {
    setSearchParams(decodeParams(window.location.search, defaultValue));
  }, [defaultValue]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopStateChange);
    return () => {
      window.removeEventListener("popstate", handlePopStateChange);
    };
  }, [handlePopStateChange]);

  return searchParams;
}