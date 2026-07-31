import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  createDateOnly,
  createDistanceMeters,
  createPlannedWorkoutId,
  createTrainingPlanId,
  createUserId,
  createUtcDateTime,
  type PlannedWorkout,
  type TrainingPlan,
} from "../domain/training";
import Calendar from "./Calendar";

const userId = createUserId("runner-1");
const planId = createTrainingPlanId("plan-1");
const timestamp = createUtcDateTime("2026-07-30T12:00:00Z");
const plan: TrainingPlan = {
  id: planId,
  userId,
  name: "First Marathon Journey",
  startDate: createDateOnly("2026-08-03"),
  targetRaceDate: createDateOnly("2026-08-16"),
  status: "active",
  createdAt: timestamp,
  updatedAt: timestamp,
};
const workouts: PlannedWorkout[] = [
  {
    id: createPlannedWorkoutId("workout-1"),
    userId,
    planId,
    scheduledDate: createDateOnly("2026-08-03"),
    phase: "base_building",
    status: "planned",
    kind: "run",
    purpose: "easy",
    targetDistance: createDistanceMeters(4_828),
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: createPlannedWorkoutId("workout-2"),
    userId,
    planId,
    scheduledDate: createDateOnly("2026-08-10"),
    phase: "base_building",
    status: "planned",
    kind: "rest",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

describe("Calendar", () => {
  it("shows an honest empty state without a plan", () => {
    render(<Calendar plan={null} workouts={[]} />);

    expect(screen.getByText(/no training plan yet/i)).toBeInTheDocument();
  });

  it("shows persisted workouts and target mileage for the first week", () => {
    render(<Calendar plan={plan} workouts={workouts} />);

    expect(screen.getByRole("combobox", { name: "Training week" })).toHaveValue("1");
    expect(screen.getByText("Target Mileage: 3 mi")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2026-08-03: Easy run" }),
    ).toBeInTheDocument();
  });

  it("shows the selected training week", async () => {
    const user = userEvent.setup();
    render(<Calendar plan={plan} workouts={workouts} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Training week" }),
      "2",
    );

    expect(
      screen.getByRole("button", { name: "2026-08-10: Rest" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "2026-08-03: Easy run" }),
    ).not.toBeInTheDocument();
  });

  it("opens and closes a persisted workout detail", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Calendar plan={plan} workouts={workouts} />);

    const trigger = getByRole("button", { name: "2026-08-03: Easy run" });
    await user.click(trigger);
    expect(
      screen.getByRole("heading", { name: "2026-08-03 Details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("dismisses the detail with Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<Calendar plan={plan} workouts={workouts} />);

    const trigger = screen.getByRole("button", { name: "2026-08-03: Easy run" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
