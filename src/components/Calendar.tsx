import { useState } from "react";

type Workout = {
  day: number;
  type: string;
  distance: number;
};

// Generate a sample 20-week plan (assuming each week repeats the 7-day structure)
const generateWorkoutPlan = () => {
  const baseWeek: Workout[] = [
    { day: 1, type: "Easy Run", distance: 3 },
    { day: 2, type: "Easy Run", distance: 3 },
    { day: 3, type: "Rest", distance: 0 },
    { day: 4, type: "Tempo Run", distance: 2 },
    { day: 5, type: "Recovery Run", distance: 2 },
    { day: 6, type: "Rest", distance: 0 },
    { day: 7, type: "Long Run", distance: 8 },
  ];

  let fullPlan: Workout[] = [];
  for (let week = 0; week < 20; week++) {
    const weekStart = week * 7;
    const weekPlan = baseWeek.map((workout, index) => ({
      day: weekStart + index + 1,
      type: workout.type,
      distance: workout.distance,
    }));
    fullPlan = [...fullPlan, ...weekPlan];
  }
  return fullPlan;
};

const workoutPlan = generateWorkoutPlan();

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
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Filter workouts based on selected week
  const startDay = (selectedWeek - 1) * 7 + 1;
  const endDay = selectedWeek * 7;
  const weekWorkouts = workoutPlan.filter((w) => w.day >= startDay && w.day <= endDay);
  const weekMileage = weekWorkouts.reduce((total, w) => total + w.distance, 0);

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
        <h2 className="section-heading">
          Training Plan -  
          <select 
            className="week-selector"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          >
            {[...Array(20)].map((_, index) => (
              <option key={index} value={index + 1}>
                Week {index + 1}
              </option>
            ))}
          </select>
        </h2>
        <p>Total Mileage: {weekMileage} mi</p>
      </div>

      {/* Calendar Grid */}
      <div className="plan-grid">
        {weekWorkouts.map((workout) => (
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
