import { Timestamp } from "firebase/firestore";
import {
  createDateOnly,
  createDistanceMeters,
  createDurationSeconds,
  createPlannedWorkoutId,
  createTrainingPlanId,
  createUserId,
  createUtcDateTime,
  validatePlannedWorkout,
  validateTrainingPlan,
  type PlannedWorkout,
  type RunPurpose,
  type TrainingPhase,
  type TrainingPlan,
  type TrainingPlanId,
  type TrainingPlanStatus,
  type UserId,
  type WorkoutStatus,
} from "../../domain/training";
import { PersistenceError } from "../errors";

export const TRAINING_SCHEMA_VERSION = 1;

const PLAN_STATUSES = ["draft", "active", "completed", "archived"] as const;
const TRAINING_PHASES = [
  "learn_to_run",
  "base_building",
  "marathon_training",
  "race_preparation",
  "recovery",
] as const;
const WORKOUT_STATUSES = ["planned", "completed", "skipped"] as const;
const RUN_PURPOSES = ["easy", "recovery", "long", "tempo", "intervals", "race"] as const;
const WORKOUT_KINDS = ["rest", "run", "walk_run"] as const;

function invalidData(message: string): never {
  throw new PersistenceError("invalid_data", message);
}

function readString(data: Record<string, unknown>, field: string): string {
  const value = data[field];
  return typeof value === "string" ? value : invalidData(`${field} must be a string.`);
}

function readOptionalString(
  data: Record<string, unknown>,
  field: string,
): string | undefined {
  const value = data[field];

  if (value === undefined) {
    return undefined;
  }

  return typeof value === "string" ? value : invalidData(`${field} must be a string.`);
}

function readOptionalNumber(
  data: Record<string, unknown>,
  field: string,
): number | undefined {
  const value = data[field];

  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? value : invalidData(`${field} must be a number.`);
}

function readEnum<const Values extends readonly string[]>(
  data: Record<string, unknown>,
  field: string,
  values: Values,
): Values[number] {
  const value = readString(data, field);

  return values.includes(value) ? value : invalidData(`${field} has an unsupported value.`);
}

function readTimestamp(data: Record<string, unknown>, field: string) {
  const value = data[field];

  if (!(value instanceof Timestamp)) {
    invalidData(`${field} must be a Firestore timestamp.`);
  }

  return createUtcDateTime(value.toDate().toISOString());
}

function timestampFromUtc(value: string): Timestamp {
  return Timestamp.fromDate(new Date(value));
}

function verifySchemaVersion(data: Record<string, unknown>): void {
  if (data.schemaVersion !== TRAINING_SCHEMA_VERSION) {
    invalidData(`Unsupported training schema version: ${String(data.schemaVersion)}.`);
  }
}

function verifyOwner(storedUserId: string, expectedUserId: UserId): UserId {
  const userId = createUserId(storedUserId);

  if (userId !== expectedUserId) {
    invalidData("Stored training data does not belong to the requested user.");
  }

  return userId;
}

export function trainingPlanToDocument(plan: TrainingPlan): Record<string, unknown> {
  return {
    schemaVersion: TRAINING_SCHEMA_VERSION,
    userId: plan.userId,
    name: plan.name,
    startDate: plan.startDate,
    targetRaceDate: plan.targetRaceDate,
    status: plan.status,
    createdAt: timestampFromUtc(plan.createdAt),
    updatedAt: timestampFromUtc(plan.updatedAt),
  };
}

export function trainingPlanFromDocument(
  id: string,
  data: Record<string, unknown>,
  expectedUserId: UserId,
): TrainingPlan {
  verifySchemaVersion(data);

  const plan: TrainingPlan = {
    id: createTrainingPlanId(id),
    userId: verifyOwner(readString(data, "userId"), expectedUserId),
    name: readString(data, "name"),
    startDate: createDateOnly(readString(data, "startDate")),
    targetRaceDate: createDateOnly(readString(data, "targetRaceDate")),
    status: readEnum(data, "status", PLAN_STATUSES) as TrainingPlanStatus,
    createdAt: readTimestamp(data, "createdAt"),
    updatedAt: readTimestamp(data, "updatedAt"),
  };

  const issues = validateTrainingPlan(plan);
  if (issues.length > 0) {
    invalidData(issues.map((issue) => issue.message).join(" "));
  }

  return plan;
}

export function plannedWorkoutToDocument(
  workout: PlannedWorkout,
): Record<string, unknown> {
  const document: Record<string, unknown> = {
    schemaVersion: TRAINING_SCHEMA_VERSION,
    userId: workout.userId,
    planId: workout.planId,
    scheduledDate: workout.scheduledDate,
    phase: workout.phase,
    status: workout.status,
    kind: workout.kind,
    createdAt: timestampFromUtc(workout.createdAt),
    updatedAt: timestampFromUtc(workout.updatedAt),
  };

  if (workout.notes !== undefined) {
    document.notes = workout.notes;
  }

  if (workout.kind === "run") {
    document.purpose = workout.purpose;
  }

  if (workout.kind !== "rest") {
    if (workout.targetDistance !== undefined) {
      document.targetDistanceMeters = workout.targetDistance;
    }

    if (workout.targetDuration !== undefined) {
      document.targetDurationSeconds = workout.targetDuration;
    }
  }

  return document;
}

export function plannedWorkoutFromDocument(
  id: string,
  data: Record<string, unknown>,
  expectedUserId: UserId,
  expectedPlanId: TrainingPlanId,
): PlannedWorkout {
  verifySchemaVersion(data);

  const userId = verifyOwner(readString(data, "userId"), expectedUserId);
  const planId = createTrainingPlanId(readString(data, "planId"));

  if (planId !== expectedPlanId) {
    invalidData("Stored workout does not belong to the requested training plan.");
  }

  const base = {
    id: createPlannedWorkoutId(id),
    userId,
    planId,
    scheduledDate: createDateOnly(readString(data, "scheduledDate")),
    phase: readEnum(data, "phase", TRAINING_PHASES) as TrainingPhase,
    status: readEnum(data, "status", WORKOUT_STATUSES) as WorkoutStatus,
    notes: readOptionalString(data, "notes"),
    createdAt: readTimestamp(data, "createdAt"),
    updatedAt: readTimestamp(data, "updatedAt"),
  };
  const kind = readEnum(data, "kind", WORKOUT_KINDS);

  let workout: PlannedWorkout;
  if (kind === "rest") {
    workout = { ...base, kind };
  } else {
    const targetDistanceValue = readOptionalNumber(data, "targetDistanceMeters");
    const targetDurationValue = readOptionalNumber(data, "targetDurationSeconds");
    const targets = {
      targetDistance:
        targetDistanceValue === undefined
          ? undefined
          : createDistanceMeters(targetDistanceValue),
      targetDuration:
        targetDurationValue === undefined
          ? undefined
          : createDurationSeconds(targetDurationValue),
    };

    workout =
      kind === "run"
        ? {
            ...base,
            ...targets,
            kind,
            purpose: readEnum(data, "purpose", RUN_PURPOSES) as RunPurpose,
          }
        : { ...base, ...targets, kind };
  }

  const issues = validatePlannedWorkout(workout);
  if (issues.length > 0) {
    invalidData(issues.map((issue) => issue.message).join(" "));
  }

  return workout;
}
