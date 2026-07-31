# Training data persistence

## Decision

Marathoner uses Cloud Firestore for authenticated training data. Firebase
Authentication already supplies the user identifier, the web application already
depends on the Firebase SDK, and Firestore provides the document ownership and
offline-friendly client model this stage of the product needs.

Components do not import Firestore. They consume typed repository interfaces
from `src/persistence/trainingRepositories.ts`. A Firestore document-store adapter
owns SDK calls, and converters translate between database documents and the
shared training domain.

The Firestore instance is created when the persistence entry point is imported,
not when Authentication starts. This keeps the Firestore SDK out of the current
application bundle until a feature actually requests training repositories.

## Ownership hierarchy

Every document is stored below the authenticated user's path:

```text
users/{userId}
  plans/{planId}
    workouts/{workoutId}
  runs/{runId}
  shoes/{shoeId}
```

The path is the primary ownership boundary. Each training document also stores
its `userId`, allowing converters to reject a document whose data disagrees with
its path. Workouts similarly store `planId` and are rejected when it disagrees
with the parent plan path.

Repositories are created for one `UserId`. Callers do not supply another user ID
to individual operations, which reduces the chance of constructing a cross-user
request.

## Common storage rules

All documents use these conventions:

| Field or concept | Representation |
| --- | --- |
| Schema version | `schemaVersion: 1` |
| IDs | Firestore document IDs, converted to branded domain IDs |
| Ownership | User path plus a matching `userId` field |
| Creation time | Native Firestore `Timestamp` in `createdAt` |
| Update time | Native Firestore `Timestamp` in `updatedAt` |
| Scheduled dates | `YYYY-MM-DD` strings |
| Distances | Whole meters |
| Durations | Whole seconds |
| Optional fields | Omitted rather than stored as `undefined` |

The repository supplies IDs, ownership, and timestamps. Components provide only
the editable product fields.

Converters reject unknown schema versions. A future schema change must add an
explicit converter or migration rather than silently guessing how older data
should be interpreted.

## Plan documents

Path: `users/{userId}/plans/{planId}`

| Field | Type |
| --- | --- |
| `schemaVersion` | `1` |
| `userId` | string |
| `name` | string |
| `startDate` | date-only string |
| `targetRaceDate` | date-only string |
| `status` | `draft`, `active`, `completed`, or `archived` |
| `createdAt` | Firestore `Timestamp` |
| `updatedAt` | Firestore `Timestamp` |

Archiving is the normal removal behavior because it preserves the runner's
history. Permanent deletion is an explicitly named repository operation. It
deletes the plan and all child workouts in the same Firestore batch so it cannot
leave orphaned workout documents. The first version limits this operation to 499
workouts because a Firestore batch supports at most 500 writes including the plan.

## Workout documents

Path: `users/{userId}/plans/{planId}/workouts/{workoutId}`

| Field | Type |
| --- | --- |
| `schemaVersion` | `1` |
| `userId` | string |
| `planId` | string |
| `scheduledDate` | date-only string |
| `phase` | shared `TrainingPhase` value |
| `status` | `planned`, `completed`, or `skipped` |
| `kind` | `rest`, `run`, or `walk_run` |
| `purpose` | shared `RunPurpose`, present for run workouts |
| `targetDistanceMeters` | optional whole number |
| `targetDurationSeconds` | optional whole number |
| `notes` | optional string |
| `createdAt` | Firestore `Timestamp` |
| `updatedAt` | Firestore `Timestamp` |

The repository verifies that the plan exists and validates every workout against
the plan's owner and inclusive date range before writing it.

## Planned run and shoe documents

The Jul 30 continuation will implement these already-reserved collections:

- `users/{userId}/runs/{runId}` stores completed-run timestamps, time zone,
  distance, duration, optional planned-workout and shoe associations, perceived
  effort, unusual-pain response, notes, and audit timestamps.
- `users/{userId}/shoes/{shoeId}` stores the shoe name, starting distance,
  active or retired status, optional retirement date, and audit timestamps.

Current shoe mileage will remain derived from starting distance plus associated
run documents. No independently editable mileage total will be stored.

## Repository behavior

The current plan and workout repositories provide create, read, list, update,
archive, and delete operations using shared domain types. They return `null` for
a missing read and throw a typed `PersistenceError` for invalid data, unavailable
storage, denied access, limits, and unexpected failures.

Raw Firebase error messages do not cross the persistence boundary. This gives
the future UI stable error categories it can turn into calm, recoverable states.

## Security and integration status

The user-scoped schema is designed for rules based on
`request.auth.uid == userId`. Those rules and their emulator tests are part of
the Jul 30 continuation of issue #12. Until those rules are deployed and tested,
the repository's ownership checks are defense in depth rather than the final
authorization boundary.

Plan, Track, and Analyze are not connected to these repositories in the Jul 29
slice. That cross-feature work remains tracked by issue #13 after the persistence
layer and authorization behavior are complete.
