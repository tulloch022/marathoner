declare const dateOnlyBrand: unique symbol;
declare const utcDateTimeBrand: unique symbol;
declare const timeZoneBrand: unique symbol;

export type DateOnly = string & { readonly [dateOnlyBrand]: "DateOnly" };
export type UtcDateTime = string & { readonly [utcDateTimeBrand]: "UtcDateTime" };
export type IanaTimeZone = string & { readonly [timeZoneBrand]: "IanaTimeZone" };

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const UTC_DATE_TIME_PATTERN =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?Z$/;

export function isDateOnly(value: unknown): value is DateOnly {
  if (typeof value !== "string") {
    return false;
  }

  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function createDateOnly(value: string): DateOnly {
  if (!isDateOnly(value)) {
    throw new Error("Date must use the YYYY-MM-DD format and represent a real calendar day.");
  }

  return value;
}

export function isUtcDateTime(value: unknown): value is UtcDateTime {
  if (typeof value !== "string") {
    return false;
  }

  const match = UTC_DATE_TIME_PATTERN.exec(value);
  if (!match || !isDateOnly(match[1])) {
    return false;
  }

  const hour = Number(match[2]);
  const minute = Number(match[3]);
  const second = Number(match[4]);

  return hour <= 23 && minute <= 59 && second <= 59 && Number.isFinite(Date.parse(value));
}

export function createUtcDateTime(value: string): UtcDateTime {
  if (!isUtcDateTime(value)) {
    throw new Error("Timestamp must be a valid UTC ISO 8601 value ending in Z.");
  }

  return new Date(value).toISOString() as UtcDateTime;
}

export function isIanaTimeZone(value: unknown): value is IanaTimeZone {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function createIanaTimeZone(value: string): IanaTimeZone {
  if (!isIanaTimeZone(value)) {
    throw new Error("Time zone must be a valid IANA time zone name.");
  }

  return value;
}
