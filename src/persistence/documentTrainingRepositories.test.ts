import { Timestamp } from "firebase/firestore";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createDateOnly,
  createDistanceMeters,
  createDurationSeconds,
  createTrainingPlanId,
  createUserId,
  createUtcDateTime,
} from "../domain/training";
import type { DocumentStore, StoredDocument } from "./documentStore";
import { createDocumentTrainingRepositories } from "./documentTrainingRepositories";
import { PersistenceError } from "./errors";
import { TRAINING_SCHEMA_VERSION } from "./firestore/converters";
import type { TrainingRepositories } from "./trainingRepositories";

class InMemoryDocumentStore implements DocumentStore {
  private nextId = 1;
  private readonly documents = new Map<string, Record<string, unknown>>();

  createId(): string {
    const id = `generated-${this.nextId}`;
    this.nextId += 1;
    return id;
  }

  async get(documentPath: string): Promise<StoredDocument | null> {
    const data = this.documents.get(documentPath);

    return data === undefined
      ? null
      : { id: documentPath.split("/").at(-1) ?? "", data };
  }

  async list(collectionPath: string): Promise<StoredDocument[]> {
    const prefix = `${collectionPath}/`;

    return [...this.documents.entries()]
      .filter(([path]) => {
        const remainder = path.slice(prefix.length);
        return path.startsWith(prefix) && !remainder.includes("/");
      })
      .map(([path, data]) => ({
        id: path.split("/").at(-1) ?? "",
        data,
      }));
  }

  async set(documentPath: string, data: Record<string, unknown>): Promise<void> {
    this.documents.set(documentPath, data);
  }

  async delete(documentPath: string): Promise<void> {
    this.documents.delete(documentPath);
  }

  async deleteMany(documentPaths: readonly string[]): Promise<void> {
    documentPaths.forEach((path) => this.documents.delete(path));
  }

  read(documentPath: string): Record<string, unknown> | undefined {
    return this.documents.get(documentPath);
  }

  overwrite(documentPath: string, data: Record<string, unknown>): void {
    this.documents.set(documentPath, data);
  }
}

const userId = createUserId("runner-1");
const now = createUtcDateTime("2026-07-29T12:00:00Z");
const planInput = {
  name: "First Marathon Journey",
  startDate: createDateOnly("2026-08-03"),
  targetRaceDate: createDateOnly("2027-05-02"),
};

let store: InMemoryDocumentStore;
let repositories: TrainingRepositories;

beforeEach(() => {
  store = new InMemoryDocumentStore();
  repositories = createDocumentTrainingRepositories(store, userId, () => now);
});

describe("training plan repository", () => {
  it("creates a draft plan under the authenticated user path", async () => {
    const plan = await repositories.plans.create(planInput);
    const document = store.read(`users/${userId}/plans/${plan.id}`);

    expect(plan).toMatchObject({
      ...planInput,
      id: "generated-1",
      userId,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    expect(document).toMatchObject({
      schemaVersion: TRAINING_SCHEMA_VERSION,
      userId,
      status: "draft",
    });
    expect(document?.createdAt).toBeInstanceOf(Timestamp);
  });

  it("reads, updates, archives, and lists plans as domain values", async () => {
    const firstPlan = await repositories.plans.create(planInput);
    const secondPlan = await repositories.plans.create({
      ...planInput,
      name: "Later Marathon",
      startDate: createDateOnly("2027-06-01"),
      targetRaceDate: createDateOnly("2028-01-09"),
    });

    await expect(repositories.plans.get(firstPlan.id)).resolves.toEqual(firstPlan);
    await expect(repositories.plans.list()).resolves.toEqual([secondPlan, firstPlan]);

    const renamed = await repositories.plans.update(firstPlan.id, {
      name: "My First Marathon",
    });
    expect(renamed.name).toBe("My First Marathon");

    const archived = await repositories.plans.archive(firstPlan.id);
    expect(archived.status).toBe("archived");
  });

  it("returns null for a missing plan and rejects an invalid update", async () => {
    const missingId = createTrainingPlanId("missing-plan");
    const plan = await repositories.plans.create(planInput);

    await expect(repositories.plans.get(missingId)).resolves.toBeNull();
    await expect(
      repositories.plans.update(plan.id, {
        startDate: createDateOnly("2027-05-03"),
      }),
    ).rejects.toMatchObject({ code: "invalid_data" });
  });

  it("rejects stored data whose owner does not match the repository user", async () => {
    const plan = await repositories.plans.create(planInput);
    const path = `users/${userId}/plans/${plan.id}`;
    const document = store.read(path);

    store.overwrite(path, { ...document, userId: "runner-2" });

    await expect(repositories.plans.get(plan.id)).rejects.toMatchObject({
      code: "invalid_data",
    });
  });

  it("rejects a stored plan with an unsupported schema version", async () => {
    const plan = await repositories.plans.create(planInput);
    const path = `users/${userId}/plans/${plan.id}`;
    const document = store.read(path);

    store.overwrite(path, { ...document, schemaVersion: 2 });

    await expect(repositories.plans.get(plan.id)).rejects.toMatchObject({
      code: "invalid_data",
    });
  });
});

describe("planned workout repository", () => {
  it("creates and orders validated workouts beneath their plan", async () => {
    const plan = await repositories.plans.create(planInput);
    const laterWorkout = await repositories.workouts.create({
      planId: plan.id,
      scheduledDate: createDateOnly("2026-08-04"),
      phase: "base_building",
      kind: "rest",
    });
    const earlierWorkout = await repositories.workouts.create({
      planId: plan.id,
      scheduledDate: createDateOnly("2026-08-03"),
      phase: "base_building",
      kind: "run",
      purpose: "easy",
      targetDistance: createDistanceMeters(4828),
    });

    await expect(repositories.workouts.listForPlan(plan.id)).resolves.toEqual([
      earlierWorkout,
      laterWorkout,
    ]);
    expect(
      store.read(
        `users/${userId}/plans/${plan.id}/workouts/${earlierWorkout.id}`,
      ),
    ).toMatchObject({
      schemaVersion: TRAINING_SCHEMA_VERSION,
      planId: plan.id,
      kind: "run",
      targetDistanceMeters: 4828,
    });
  });

  it("updates workout status and allows an optional target to be cleared", async () => {
    const plan = await repositories.plans.create(planInput);
    const workout = await repositories.workouts.create({
      planId: plan.id,
      scheduledDate: createDateOnly("2026-08-03"),
      phase: "base_building",
      kind: "run",
      purpose: "easy",
      targetDistance: createDistanceMeters(4828),
      targetDuration: createDurationSeconds(30 * 60),
    });

    const updated = await repositories.workouts.update(plan.id, workout.id, {
      status: "completed",
      targetDuration: null,
    });

    if (updated.kind === "rest") {
      throw new PersistenceError("invalid_data", "Expected an updated run workout.");
    }

    expect(updated.status).toBe("completed");
    expect(updated.targetDuration).toBeUndefined();
    expect(updated.targetDistance).toBe(4828);
  });

  it("rejects a workout outside the plan date range", async () => {
    const plan = await repositories.plans.create(planInput);

    await expect(
      repositories.workouts.create({
        planId: plan.id,
        scheduledDate: createDateOnly("2027-05-03"),
        phase: "recovery",
        kind: "rest",
      }),
    ).rejects.toMatchObject({ code: "invalid_data" });
  });

  it("requires a real plan before creating a workout", async () => {
    await expect(
      repositories.workouts.create({
        planId: createTrainingPlanId("missing-plan"),
        scheduledDate: createDateOnly("2026-08-03"),
        phase: "base_building",
        kind: "rest",
      }),
    ).rejects.toMatchObject({ code: "not_found" });
  });

  it("deletes an individual workout without deleting its plan", async () => {
    const plan = await repositories.plans.create(planInput);
    const workout = await repositories.workouts.create({
      planId: plan.id,
      scheduledDate: createDateOnly("2026-08-03"),
      phase: "base_building",
      kind: "rest",
    });

    await repositories.workouts.delete(plan.id, workout.id);

    await expect(repositories.workouts.get(plan.id, workout.id)).resolves.toBeNull();
    await expect(repositories.plans.get(plan.id)).resolves.toEqual(plan);
  });

  it("permanently deletes a plan and its workouts together", async () => {
    const plan = await repositories.plans.create(planInput);
    const workout = await repositories.workouts.create({
      planId: plan.id,
      scheduledDate: createDateOnly("2026-08-03"),
      phase: "base_building",
      kind: "rest",
    });

    await repositories.plans.permanentlyDelete(plan.id);

    await expect(repositories.plans.get(plan.id)).resolves.toBeNull();
    await expect(repositories.workouts.get(plan.id, workout.id)).resolves.toBeNull();
  });
});
