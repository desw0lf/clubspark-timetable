export interface ClubSparkId {
  id: string;
  friendlyName: undefined | string;
  disabled?: boolean;
  uid: string;
}

export const DEFAULT_CLUBSPARK_ID_LIST = import.meta.env.VITE_DEFAULT_CLUBSPARK_ID_LIST.split(",").map((item) => {
  const [id, friendlyName] = item.split("@");
  return { id, friendlyName } as ClubSparkId;
});