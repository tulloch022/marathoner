declare const distanceBrand: unique symbol;
declare const durationBrand: unique symbol;

export type DistanceMeters = number & { readonly [distanceBrand]: "DistanceMeters" };
export type DurationSeconds = number & { readonly [durationBrand]: "DurationSeconds" };
export type DistanceUnit = "mile" | "kilometer";

export interface Pace {
  readonly secondsPerUnit: number;
  readonly unit: DistanceUnit;
}

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_KILOMETER = 1000;

export function createDistanceMeters(value: number): DistanceMeters {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Distance must be a non-negative whole number of meters.");
  }

  return value as DistanceMeters;
}

export function createDurationSeconds(value: number): DurationSeconds {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Duration must be a non-negative whole number of seconds.");
  }

  return value as DurationSeconds;
}

export function milesToMeters(miles: number): DistanceMeters {
  if (!Number.isFinite(miles) || miles < 0) {
    throw new Error("Miles must be a non-negative number.");
  }

  return createDistanceMeters(Math.round(miles * METERS_PER_MILE));
}

export function kilometersToMeters(kilometers: number): DistanceMeters {
  if (!Number.isFinite(kilometers) || kilometers < 0) {
    throw new Error("Kilometers must be a non-negative number.");
  }

  return createDistanceMeters(Math.round(kilometers * METERS_PER_KILOMETER));
}

export function metersToMiles(meters: DistanceMeters): number {
  return meters / METERS_PER_MILE;
}

export function metersToKilometers(meters: DistanceMeters): number {
  return meters / METERS_PER_KILOMETER;
}

export function calculatePace(
  distance: DistanceMeters,
  duration: DurationSeconds,
  unit: DistanceUnit,
): Pace | null {
  if (distance === 0 || duration === 0) {
    return null;
  }

  const metersPerUnit = unit === "mile" ? METERS_PER_MILE : METERS_PER_KILOMETER;

  return {
    secondsPerUnit: (duration * metersPerUnit) / distance,
    unit,
  };
}
