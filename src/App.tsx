import { useState } from "react";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx";
import Subtitle from "./components/Subtitle.tsx";
import ScrollDownArrow from "./components/ScrollDownArrow.tsx";
import Calendar from "./components/Calendar.tsx";
import SignUpButton from "./components/SignUpButton.tsx";
import { motion } from "framer-motion";

function App() {
  const [activeSection, setActiveSection] = useState<"plan" | null>(null);

  return (
    <div className="main flex flex-col items-center justify-center h-screen">
      {/* Login & Signup Buttons */}
      <LoginButton />
      <SignUpButton />
      <Title />
      <Subtitle />
      <ScrollDownArrow />

      {/* Main Buttons */}
      <div className="box-container flex gap-4">
        <motion.button
          className="box-under-arrow"
          onClick={() => setActiveSection("plan")}
          animate={activeSection === "plan" ? { width: "100vw", height: "100vh" } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ overflow: "hidden", position: "relative" }}
        >
          {activeSection === "plan" ? (
            <PlanSection onClose={() => setActiveSection(null)} />
          ) : (
            <p>Plan</p>
          )}
        </motion.button>

        <button className="box-under-arrow">
          <p>Track</p>
        </button>
        <button className="box-under-arrow">
          <p>Analyze</p>
        </button>
      </div>
    </div>
  );
}

function PlanSection({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white">
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl">✖</button>
      <h1 className="text-3xl font-bold">Plan Your Training</h1>
      <Calendar />
    </div>
  );
}

export default App;
