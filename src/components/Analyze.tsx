import { motion } from "framer-motion";

// Remove the onClose prop if not needed
export default function Analyze() {
  // Dummy analytics data – replace with real calculations as needed.
  const totalMileage = 42;
  const averagePace = "7:30";
  const runsThisWeek = 5;

  return (
    <motion.div
      className="analyze-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="analyze-cards">
        <div className="analyze-card">
          <h2>Total Mileage</h2>
          <p>{totalMileage} mi</p>
        </div>
        <div className="analyze-card">
          <h2>Average Pace</h2>
          <p>{averagePace} /mi</p>
        </div>
        <div className="analyze-card">
          <h2>Runs This Week</h2>
          <p>{runsThisWeek}</p>
        </div>
      </div>
    </motion.div>
  );
}
