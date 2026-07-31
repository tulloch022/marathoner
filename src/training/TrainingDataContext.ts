import { createContext } from "react";
import type {
  CompletedRun,
  CompletedRunId,
  PlannedWorkout,
  Shoe,
  TrainingPlan,
} from "../domain/training";
import type {
  CreateCompletedRunInput,
  CreateShoeInput,
  UpdateCompletedRunInput,
} from "../persistence/trainingRepositories";

export type TrainingDataStatus = "loading" | "ready" | "error";

export interface TrainingDataContextValue {
  readonly status: TrainingDataStatus;
  readonly error: string | null;
  readonly plans: TrainingPlan[];
  readonly workouts: PlannedWorkout[];
  readonly runs: CompletedRun[];
  readonly shoes: Shoe[];
  readonly reload: () => Promise<void>;
  readonly createShoe: (input: CreateShoeInput) => Promise<Shoe>;
  readonly createRun: (input: CreateCompletedRunInput) => Promise<CompletedRun>;
  readonly updateRun: (
    id: CompletedRunId,
    changes: UpdateCompletedRunInput,
  ) => Promise<CompletedRun>;
  readonly deleteRun: (id: CompletedRunId) => Promise<void>;
}

export const TrainingDataContext = createContext<
  TrainingDataContextValue | undefined
>(undefined);
