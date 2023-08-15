export const generateParams = (
  params: { [key: string]: string | number | null | boolean | undefined } | null,
  trailingMark: boolean | string = true
): string => {
  if (params === null) {
    return "";
  }
  const keys = Object.keys(params).filter((key: string) => params[key] !== undefined);
  if (keys.length === 0) {
    return "";
  }
  const mark = trailingMark === true ? "?" : trailingMark || "";
  return (
    mark +
    keys
      .map((key: string) => {
        const value =
          params[key] === undefined || params[key] === null
            ? ""
            : encodeURIComponent(params[key] as string | boolean | number);
        return key + "=" + value;
      })
      .join("&")
  );
};

export const decodeParams = (searchString: string | null, defaultValue = {}): { [key: string]: string } => {
  if (!searchString || searchString === "") {
    return defaultValue;
  }

  const search = searchString.substring(1);

  try {
    return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
      let newValue = value;
      if (key !== "") {
        try {
          newValue = decodeURIComponent(value);
        } catch {
          newValue = "";
        }
      }
      return newValue;
    });
  } catch (err) {
    console.error("Invalid URL");
    return defaultValue;
  }
};