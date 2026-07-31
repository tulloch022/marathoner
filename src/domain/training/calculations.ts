import { createDateOnly, type DateOnly } from "./dates";
import type { ShoeId, UserId } from "./identifiers";
import type { CompletedRun, Shoe } from "./types";
import {
  calculatePace,
  createDistanceMeters,
  createDurationSeconds,
  type DistanceMeters,
  type DistanceUnit,
  type Pace,
} from "./units";

export interface TrainingAnalytics {
  readonly totalDistance: DistanceMeters;
  readonly weeklyDistance: DistanceMeters;
  readonly averagePace: Pace | null;
  readonly totalRuns: number;
  readonly runsThisWeek: number;
}

export function calculateTotalDistance(runs: readonly CompletedRun[]): DistanceMeters {
  const total = runs.reduce((sum, run) => sum + run.distance, 0);
  return createDistanceMeters(total);
}

export function calculateShoeDistance(
  shoe: Shoe,
  runs: readonly CompletedRun[],
): DistanceMeters {
  const loggedDistance = runs
    .filter((run) => run.userId === shoe.userId && run.shoeId === shoe.id)
    .reduce((sum, run) => sum + run.distance, 0);

  return createDistanceMeters(shoe.startingDistance + loggedDistance);
}

export function findRunsForShoe(
  runs: readonly CompletedRun[],
  userId: UserId,
  shoeId: ShoeId,
): CompletedRun[] {
  return runs.filter((run) => run.userId === userId && run.shoeId === shoeId);
}

function addDays(date: DateOnly, numberOfDays: number): DateOnly {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + numberOfDays);
  return createDateOnly(value.toISOString().slice(0, 10));
}

export function getRunLocalDate(run: CompletedRun): DateOnly {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: run.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(run.startedAt));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return createDateOnly(`${values.year}-${values.month}-${values.day}`);
}

export function calculateTrainingAnalytics(
  runs: readonly CompletedRun[],
  weekStart: DateOnly,
  distanceUnit: DistanceUnit,
): TrainingAnalytics {
  const weekEnd = addDays(weekStart, 6);
  const weeklyRuns = runs.filter((run) => {
    const runDate = getRunLocalDate(run);
    return runDate >= weekStart && runDate <= weekEnd;
  });
  const totalDistance = calculateTotalDistance(runs);
  const totalDuration = createDurationSeconds(
    runs.reduce((sum, run) => sum + run.duration, 0),
  );

  return {
    totalDistance,
    weeklyDistance: calculateTotalDistance(weeklyRuns),
    averagePace: calculatePace(totalDistance, totalDuration, distanceUnit),
    totalRuns: runs.length,
    runsThisWeek: weeklyRuns.length,
  };
}
