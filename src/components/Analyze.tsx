import { motion } from "framer-motion";
import {
  calculateTrainingAnalytics,
  createDateOnly,
  metersToMiles,
  type CompletedRun,
  type DistanceMeters,
} from "../domain/training";

type AnalyzeProps = {
  readonly runs: readonly CompletedRun[];
  readonly now?: Date;
};

function mondayFor(date: Date) {
  const monday = new Date(date);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(monday.getDate()).padStart(2, "0");
  return createDateOnly(`${year}-${month}-${dayOfMonth}`);
}

function formatMiles(distance: DistanceMeters): string {
  return Number(metersToMiles(distance).toFixed(1)).toString();
}

function formatPace(secondsPerMile: number | undefined): string {
  if (secondsPerMile === undefined) return "Not enough data";
  const rounded = Math.round(secondsPerMile);
  const minutes = Math.floor(rounded / 60);
  const seconds = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${seconds} /mi`;
}

export default function Analyze({ runs, now = new Date() }: AnalyzeProps) {
  const analytics = calculateTrainingAnalytics(runs, mondayFor(now), "mile");

  return (
    <motion.div
      className="analyze-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {runs.length === 0 && (
        <p className="training-empty-state">
          Log your first run to begin building your training picture.
        </p>
      )}
      <div className="analyze-cards">
        <div className="analyze-card">
          <h2>Total Mileage</h2>
          <p>{formatMiles(analytics.totalDistance)} mi</p>
        </div>
        <div className="analyze-card">
          <h2>This Week</h2>
          <p>{formatMiles(analytics.weeklyDistance)} mi</p>
        </div>
        <div className="analyze-card">
          <h2>Average Pace</h2>
          <p>{formatPace(analytics.averagePace?.secondsPerUnit)}</p>
        </div>
        <div className="analyze-card">
          <h2>Total Runs</h2>
          <p>{analytics.totalRuns}</p>
        </div>
        <div className="analyze-card">
          <h2>Runs This Week</h2>
          <p>{analytics.runsThisWeek}</p>
        </div>
      </div>
    </motion.div>
  );
}
