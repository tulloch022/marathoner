import { useState } from "react";
import { motion } from "framer-motion";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx";
import Subtitle from "./components/Subtitle.tsx";
import Calendar from "./components/Calendar.tsx";
import SignUpButton from "./components/SignUpButton.tsx";
import ShoeTracker from "./components/ShoeTracker.tsx";

function App() {
  const [activeSection, setActiveSection] = useState<"plan" | "track" | "analyze" | null>(null);

  return (
    <motion.div
      className="main flex flex-col items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5, ease: "easeOut" }}
    >
      {/* Login & Signup Buttons - Hidden when a section is active */}
      {!activeSection && (
        <>
          <LoginButton />
          <SignUpButton />
          <Title />
          <Subtitle />
        </>
      )}

      {/* Main Buttons */}
      <div className="box-container flex gap-4 relative">
        {["plan", "track", "analyze"].map((section) => (
          <motion.button
            key={section}
            className="box-under-arrow"
            onClick={() => setActiveSection(section as "plan" | "track" | "analyze")}
            animate={{
              width: activeSection === section ? "80vw" : "10vw",
              height: activeSection === section ? "100vh" : "2em",
            }}
            transition={{ duration: 3 }}
            style={{ overflow: "hidden", position: "relative", zIndex: 1 }}
          >
            {activeSection === section ? (
              <SectionContent section={section} onClose={() => setActiveSection(null)} />
            ) : (
              <p>{section.charAt(0).toUpperCase() + section.slice(1)}</p>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function SectionContent({ section, onClose }: { section: "plan" | "track" | "analyze"; onClose: () => void }) {
  return (
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 text-2xl">X</button>
      <h1 className="text-3xl font-bold">
        {section === "plan" && "Plan Your Training"}
        {section === "track" && "Track Your Runs"}
        {section === "analyze" && "Analyze Your Progress"}
      </h1>
      {section === "plan" && <Calendar />}
      {section === "track" && <ShoeTracker />}
      {section === "analyze" && <div> {/* Add analysis content here */} </div>}
    </motion.div>
  );
}

export default App;
