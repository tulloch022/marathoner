import type {
  PlannedWorkoutId,
  TrainingPlanId,
  UserId,
} from "../../domain/training";

export const userDocumentPath = (userId: UserId): string => `users/${userId}`;

export const plansCollectionPath = (userId: UserId): string =>
  `${userDocumentPath(userId)}/plans`;

export const planDocumentPath = (userId: UserId, planId: TrainingPlanId): string =>
  `${plansCollectionPath(userId)}/${planId}`;

export const workoutsCollectionPath = (
  userId: UserId,
  planId: TrainingPlanId,
): string => `${planDocumentPath(userId, planId)}/workouts`;

export const workoutDocumentPath = (
  userId: UserId,
  planId: TrainingPlanId,
  workoutId: PlannedWorkoutId,
): string => `${workoutsCollectionPath(userId, planId)}/${workoutId}`;
