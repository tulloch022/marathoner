import { useState } from "react";

type Workout = {
  day: number;
  type: string;
  distance: number;
};

// Sample workout plan for 30 days (feel free to complete/update as needed)
const workoutPlan: Workout[] = [
  { day: 1, type: "Rest", distance: 0 },
  { day: 2, type: "Easy Run", distance: 3 },
  { day: 3, type: "Tempo Run", distance: 4 },
  { day: 4, type: "Long Run", distance: 8 },
  { day: 5, type: "Recovery Run", distance: 2 },
  { day: 6, type: "Easy Run", distance: 3 },
  { day: 7, type: "Rest", distance: 0 },
  // ... add entries for days 8-30
];

// Abbreviations for workouts
const workoutAbbr: Record<string, string> = {
  "Long Run": "LR",
  "Easy Run": "E",
  "Tempo Run": "T",
  "Recovery Run": "RR",
  "Rest": "R",
};

// Return a CSS class based on the workout type
function getWorkoutColorClass(type: string): string {
  switch (type) {
    case "Long Run":
      return "long-run";
    case "Easy Run":
      return "easy-run";
    case "Tempo Run":
      return "tempo-run";
    case "Recovery Run":
      return "recovery-run";
    case "Rest":
      return "rest-day";
    default:
      return "";
  }
}

export default function Plan() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // For example, compute the summary for week 1 (days 1-7)
  const weekOneWorkouts = workoutPlan.filter((w) => w.day >= 1 && w.day <= 7);
  const weekOneMileage = weekOneWorkouts.reduce((total, w) => total + w.distance, 0);

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
  };

  return (
    <div className="plan-container">
      {/* Header Section */}
      <div className="plan-header">
        <h2 className="section-heading">Training Plan - Week 1</h2>
        <p>Total Mileage: {weekOneMileage} mi</p>
      </div>

      {/* Calendar Grid */}
      <div className="plan-grid">
        {workoutPlan.map((workout) => (
          <div
            key={workout.day}
            className={`plan-day ${getWorkoutColorClass(workout.type)}`}
            onClick={() => handleWorkoutClick(workout)}
          >
            <div className="plan-day-number">{workout.day}</div>
            <div className="plan-day-abbr">{workoutAbbr[workout.type]}</div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedWorkout && (
        <div className="plan-modal-overlay" onClick={closeModal}>
          <div className="plan-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Day {selectedWorkout.day} Details</h3>
            <p>
              <strong>Workout:</strong> {selectedWorkout.type}
            </p>
            {selectedWorkout.distance > 0 && (
              <p>
                <strong>Distance:</strong> {selectedWorkout.distance} mi
              </p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
