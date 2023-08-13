export const nowDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
}