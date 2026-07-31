import { useEffect, useMemo, useRef, useState } from "react";
import {
  metersToMiles,
  type PlannedWorkout,
  type TrainingPlan,
} from "../domain/training";

type CalendarProps = {
  readonly plan: TrainingPlan | null;
  readonly workouts: readonly PlannedWorkout[];
};

const workoutAbbr = {
  long: "LR",
  easy: "E",
  tempo: "T",
  recovery: "RR",
  intervals: "I",
  race: "RACE",
  walk_run: "WR",
  rest: "R",
} as const;

function addDays(date: string, numberOfDays: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + numberOfDays);
  return value.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  return Math.floor(
    (Date.parse(`${end}T00:00:00.000Z`) -
      Date.parse(`${start}T00:00:00.000Z`)) /
      86_400_000,
  );
}

function workoutLabel(workout: PlannedWorkout): string {
  if (workout.kind === "rest") return "Rest";
  if (workout.kind === "walk_run") return "Walk/run";
  return `${workout.purpose[0].toUpperCase()}${workout.purpose.slice(1)} run`;
}

function workoutAbbreviation(workout: PlannedWorkout): string {
  if (workout.kind === "rest") return workoutAbbr.rest;
  if (workout.kind === "walk_run") return workoutAbbr.walk_run;
  return workoutAbbr[workout.purpose];
}

function workoutColorClass(workout: PlannedWorkout): string {
  if (workout.kind === "rest") return "rest-day";
  if (workout.kind === "walk_run") return "easy-run";
  return `${workout.purpose.replace("_", "-")}-run`;
}

export default function Calendar({ plan, workouts }: CalendarProps) {
  const [selectedWorkout, setSelectedWorkout] =
    useState<PlannedWorkout | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSelectedWeek(1);
    setSelectedWorkout(null);
  }, [plan?.id]);

  useEffect(() => {
    if (!selectedWorkout) return undefined;

    const dialog = dialogRef.current;
    const focusable = dialog
      ? Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedWorkout(null);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedWorkout]);

  const weekCount = useMemo(() => {
    if (plan === null) return 0;
    return Math.max(1, Math.ceil((daysBetween(plan.startDate, plan.targetRaceDate) + 1) / 7));
  }, [plan]);

  if (plan === null) {
    return (
      <p className="training-empty-state">
        No training plan yet. Your plan will appear here once it has been created.
      </p>
    );
  }

  const weekStart = addDays(plan.startDate, (selectedWeek - 1) * 7);
  const weekEnd = addDays(weekStart, 6);
  const weekWorkouts = workouts.filter(
    (workout) =>
      workout.planId === plan.id &&
      workout.scheduledDate >= weekStart &&
      workout.scheduledDate <= weekEnd,
  );
  const targetMileage = weekWorkouts.reduce(
    (total, workout) =>
      total +
      (workout.kind === "rest" || workout.targetDistance === undefined
        ? 0
        : metersToMiles(workout.targetDistance)),
    0,
  );

  return (
    <div className="plan-container">
      <div className="plan-header">
        <h2 className="section-heading">
          {plan.name} Week{" "}
          <select
            aria-label="Training week"
            className="week-selector"
            value={selectedWeek}
            onChange={(event) => setSelectedWeek(Number(event.target.value))}
          >
            {Array.from({ length: weekCount }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </h2>
        <p>
          {weekStart} to {weekEnd}
        </p>
        <p>Target Mileage: {Number(targetMileage.toFixed(1))} mi</p>
      </div>

      {weekWorkouts.length === 0 ? (
        <p className="training-empty-state">No workouts are scheduled this week.</p>
      ) : (
        <div className="plan-grid">
          {weekWorkouts.map((workout) => (
            <button
              key={workout.id}
              type="button"
              className={`plan-day ${workoutColorClass(workout)} ${workout.status}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedWorkout(workout);
              }}
              aria-label={`${workout.scheduledDate}: ${workoutLabel(workout)}`}
            >
              <span className="plan-day-number">{workout.scheduledDate.slice(5)}</span>
              <span className="plan-day-abbr">
                {workoutAbbreviation(workout)}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedWorkout && (
        <div
          className="plan-modal-overlay"
          onClick={() => setSelectedWorkout(null)}
        >
          <div
            className="plan-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-detail-title"
            ref={dialogRef}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="workout-detail-title">
              {selectedWorkout.scheduledDate} Details
            </h3>
            <p>
              <strong>Workout:</strong> {workoutLabel(selectedWorkout)}
            </p>
            <p>
              <strong>Status:</strong> {selectedWorkout.status}
            </p>
            {selectedWorkout.kind !== "rest" &&
              selectedWorkout.targetDistance !== undefined && (
                <p>
                  <strong>Distance:</strong>{" "}
                  {Number(metersToMiles(selectedWorkout.targetDistance).toFixed(1))} mi
                </p>
              )}
            <button type="button" onClick={() => setSelectedWorkout(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
