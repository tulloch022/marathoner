import { useState } from "react";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx";
import Subtitle from "./components/Subtitle.tsx";
import ScrollDownArrow from "./components/ScrollDownArrow.tsx";
import Calendar from "./components/Calendar.tsx";
import SignUpButton from "./components/SignUpButton.tsx";
import ShoeTracker from "./components/ShoeTracker.tsx"
import { motion } from "framer-motion";

function App() {
  const [activeSection, setActiveSection] = useState<"plan" | "track" | "analyze" | null>(null);

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
        {["plan", "track", "analyze"].map((section) =>
          activeSection === null || activeSection === section ? ( // Hide other buttons
            <motion.button
              key={section}
              className="box-under-arrow"
              onClick={() => setActiveSection(section as "plan" | "track" | "analyze")}
              animate={activeSection === section ? { width: "80vw", height: "100%"} : {}}
              transition={{ duration: 0.3, ease: "linear" }}
              style={{ overflow: "hidden", position: "relative" }}
            >
              {activeSection === section ? (
                <SectionContent section={section} onClose={() => setActiveSection(null)} />
              ) : (
                <p>{section.charAt(0).toUpperCase() + section.slice(1)}</p>
              )}
            </motion.button>
          ) : null
        )}
      </div>
    </div>
  );
}

function SectionContent({ section, onClose }: { section: "plan" | "track" | "analyze"; onClose: () => void }) {
  return (
    <div className="">
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl">✖</button>
      <h1 className="text-3xl font-bold">
        {section === "plan"}
        {section === "track"}
        {section === "analyze" && "Analyze Your Progress"}
      </h1>
      {section === "plan" && <Calendar />}
      {section === "track" && <ShoeTracker />}
      {/* Add more components here for Track & Analyze if needed */}
    </div>
  );
}

export default App;
