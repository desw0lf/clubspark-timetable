export interface ClubSparkId {
  id: string;
  friendlyName: undefined | string;
  disabled?: boolean;
}

export const DEFAULT_CLUBSPARK_ID_LIST = import.meta.env.VITE_DEFAULT_CLUBSPARK_ID_LIST.split(",").map((item) => {
  const [id, friendlyName] = item.split("@");
  return { id, friendlyName };
});