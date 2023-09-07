export function toIso(d: Date): string {
  return d.toISOString().split(".")[0] + "Z";
}

export function toUtcDate(d: Date): Date {
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

export function addDays(d: Date, no = 1): Date {
  d.setDate(d.getDate() + no)
  return d;
}

export function toUtcIso(d: Date): string {
  return toIso(toUtcDate(d));
}