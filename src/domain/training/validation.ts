import type { TrainingPlan, PlannedWorkout, CompletedRun, Shoe, UserProfile } from "./types";

export interface ValidationIssue {
  readonly field: string;
  readonly message: string;
}

function validateText(value: string | undefined, field: string, required: boolean): ValidationIssue[] {
  if (value === undefined) {
    return required ? [{ field, message: `${field} is required.` }] : [];
  }

  if (value.trim().length === 0) {
    return [{ field, message: `${field} cannot be blank.` }];
  }

  return [];
}

function validateTimestamps(entity: { createdAt: string; updatedAt: string }): ValidationIssue[] {
  if (entity.updatedAt < entity.createdAt) {
    return [{ field: "updatedAt", message: "updatedAt cannot be earlier than createdAt." }];
  }

  return [];
}

export function validateUserProfile(profile: UserProfile): ValidationIssue[] {
  return [
    ...validateText(profile.displayName, "displayName", false),
    ...validateTimestamps(profile),
  ];
}

export function validateTrainingPlan(plan: TrainingPlan): ValidationIssue[] {
  const issues = [
    ...validateText(plan.name, "name", true),
    ...validateTimestamps(plan),
  ];

  if (plan.targetRaceDate < plan.startDate) {
    issues.push({ field: "targetRaceDate", message: "Target race date cannot precede plan start date." });
  }

  return issues;
}

export function validatePlannedWorkout(workout: PlannedWorkout): ValidationIssue[] {
  const issues = [
    ...validateText(workout.notes, "notes", false),
    ...validateTimestamps(workout),
  ];

  if (workout.kind !== "rest") {
    const hasPositiveDistance = workout.targetDistance !== undefined && workout.targetDistance > 0;
    const hasPositiveDuration = workout.targetDuration !== undefined && workout.targetDuration > 0;

    if (!hasPositiveDistance && !hasPositiveDuration) {
      issues.push({
        field: "targetDistance",
        message: "A run or walk-run workout needs a positive target distance or duration.",
      });
    }
  }

  return issues;
}

export function validateWorkoutForPlan(
  workout: PlannedWorkout,
  plan: TrainingPlan,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (workout.planId !== plan.id) {
    issues.push({ field: "planId", message: "Workout must reference the supplied training plan." });
  }

  if (workout.userId !== plan.userId) {
    issues.push({ field: "userId", message: "Workout and plan must belong to the same user." });
  }

  if (workout.scheduledDate < plan.startDate || workout.scheduledDate > plan.targetRaceDate) {
    issues.push({
      field: "scheduledDate",
      message: "Workout date must fall within the training plan date range.",
    });
  }

  return issues;
}

export function validateCompletedRun(run: CompletedRun): ValidationIssue[] {
  const issues = [
    ...validateText(run.notes, "notes", false),
    ...validateTimestamps(run),
  ];

  if (run.distance <= 0) {
    issues.push({ field: "distance", message: "Completed run distance must be positive." });
  }

  if (run.duration <= 0) {
    issues.push({ field: "duration", message: "Completed run duration must be positive." });
  }

  return issues;
}

export function validateShoe(shoe: Shoe): ValidationIssue[] {
  const issues = [
    ...validateText(shoe.name, "name", true),
    ...validateTimestamps(shoe),
  ];

  if (shoe.status === "retired" && shoe.retiredOn === undefined) {
    issues.push({ field: "retiredOn", message: "A retired shoe needs a retirement date." });
  }

  if (shoe.status === "active" && shoe.retiredOn !== undefined) {
    issues.push({ field: "retiredOn", message: "An active shoe cannot have a retirement date." });
  }

  return issues;
}
