import { FirebaseError } from "firebase/app";

export type PersistenceErrorCode =
  | "not_found"
  | "invalid_data"
  | "conflict"
  | "permission_denied"
  | "unavailable"
  | "limit_exceeded"
  | "unknown";

export class PersistenceError extends Error {
  readonly code: PersistenceErrorCode;
  readonly cause?: unknown;

  constructor(code: PersistenceErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "PersistenceError";
    this.code = code;
    this.cause = cause;
  }
}

export function toPersistenceError(error: unknown): PersistenceError {
  if (error instanceof PersistenceError) {
    return error;
  }

  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return new PersistenceError(
        "permission_denied",
        "You do not have permission to access this training data.",
        error,
      );
    }

    if (error.code === "unavailable") {
      return new PersistenceError(
        "unavailable",
        "Training data is temporarily unavailable. Please try again.",
        error,
      );
    }
  }

  return new PersistenceError(
    "unknown",
    "Training data could not be saved or loaded. Please try again.",
    error,
  );
}
