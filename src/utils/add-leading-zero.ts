export function addLeadingZero(str: string, pad = 2) {
  return str.padStart(pad, "0");
}