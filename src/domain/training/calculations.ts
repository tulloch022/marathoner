import type { ShoeId, UserId } from "./identifiers";
import type { CompletedRun, Shoe } from "./types";
import { createDistanceMeters, type DistanceMeters } from "./units";

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
