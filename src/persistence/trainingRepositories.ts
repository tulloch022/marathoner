import type {
  DateOnly,
  DistanceMeters,
  DurationSeconds,
  PlannedWorkout,
  PlannedWorkoutId,
  RunPurpose,
  TrainingPhase,
  TrainingPlan,
  TrainingPlanId,
  TrainingPlanStatus,
  WorkoutStatus,
} from "../domain/training";

export interface CreateTrainingPlanInput {
  readonly name: string;
  readonly startDate: DateOnly;
  readonly targetRaceDate: DateOnly;
}

export interface UpdateTrainingPlanInput {
  readonly name?: string;
  readonly startDate?: DateOnly;
  readonly targetRaceDate?: DateOnly;
  readonly status?: TrainingPlanStatus;
}

interface CreatePlannedWorkoutBase {
  readonly planId: TrainingPlanId;
  readonly scheduledDate: DateOnly;
  readonly phase: TrainingPhase;
  readonly notes?: string;
}

export interface CreateRestWorkoutInput extends CreatePlannedWorkoutBase {
  readonly kind: "rest";
}

export interface CreateRunWorkoutInput extends CreatePlannedWorkoutBase {
  readonly kind: "run";
  readonly purpose: RunPurpose;
  readonly targetDistance?: DistanceMeters;
  readonly targetDuration?: DurationSeconds;
}

export interface CreateWalkRunWorkoutInput extends CreatePlannedWorkoutBase {
  readonly kind: "walk_run";
  readonly targetDistance?: DistanceMeters;
  readonly targetDuration?: DurationSeconds;
}

export type CreatePlannedWorkoutInput =
  | CreateRestWorkoutInput
  | CreateRunWorkoutInput
  | CreateWalkRunWorkoutInput;

export interface UpdatePlannedWorkoutInput {
  readonly scheduledDate?: DateOnly;
  readonly phase?: TrainingPhase;
  readonly status?: WorkoutStatus;
  readonly notes?: string | null;
  readonly purpose?: RunPurpose;
  readonly targetDistance?: DistanceMeters | null;
  readonly targetDuration?: DurationSeconds | null;
}

export interface TrainingPlanRepository {
  create(input: CreateTrainingPlanInput): Promise<TrainingPlan>;
  get(id: TrainingPlanId): Promise<TrainingPlan | null>;
  list(): Promise<TrainingPlan[]>;
  update(id: TrainingPlanId, changes: UpdateTrainingPlanInput): Promise<TrainingPlan>;
  archive(id: TrainingPlanId): Promise<TrainingPlan>;
  permanentlyDelete(id: TrainingPlanId): Promise<void>;
}

export interface PlannedWorkoutRepository {
  create(input: CreatePlannedWorkoutInput): Promise<PlannedWorkout>;
  get(planId: TrainingPlanId, id: PlannedWorkoutId): Promise<PlannedWorkout | null>;
  listForPlan(planId: TrainingPlanId): Promise<PlannedWorkout[]>;
  update(
    planId: TrainingPlanId,
    id: PlannedWorkoutId,
    changes: UpdatePlannedWorkoutInput,
  ): Promise<PlannedWorkout>;
  delete(planId: TrainingPlanId, id: PlannedWorkoutId): Promise<void>;
}

export interface TrainingRepositories {
  readonly plans: TrainingPlanRepository;
  readonly workouts: PlannedWorkoutRepository;
}
