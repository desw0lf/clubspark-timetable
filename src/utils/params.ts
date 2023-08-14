export const decodeParams = (searchString: string | null, defaultValue = {}): any => {
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