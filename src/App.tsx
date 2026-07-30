import { useState } from "react";
import { motion } from "framer-motion";
import LoginButton from "./components/LoginButton";
import Title from "./components/Title";
import Subtitle from "./components/Subtitle";
import Calendar from "./components/Calendar";
import SignUpButton from "./components/SignUpButton";
import ShoeTracker from "./components/ShoeTracker";
import Analyze from "./components/Analyze";

function App() {
  const [activeSection, setActiveSection] = useState<"plan" | "track" | "analyze" | null>(null);
  const sections = ["plan", "track", "analyze"] as const;
  const visibleSections = activeSection ? [activeSection] : sections;

  return (
    <motion.div
      className="main flex flex-col items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Login & Signup Buttons – Hidden when a section is active */}
      {!activeSection && (
        <>
          <LoginButton />
          <SignUpButton />
          <Title />
          <Subtitle />
        </>
      )}


      <div className="box-container flex gap-4 relative">
        {visibleSections.map((section) => (
          activeSection === section ? (
            <motion.div
              key={section}
              className="box-under-arrow active-section-panel"
              initial={{ width: "7em", height: "2em" }}
              animate={{ width: "100vw", height: "100vh" }}
              transition={{ duration: .25 }}
            >
              <SectionContent section={section} onClose={() => setActiveSection(null)} />
            </motion.div>
          ) : (
            <motion.button
              key={section}
              className="box-under-arrow"
              initial={{ width: "50vw", height: "3em" }}
              onClick={() => setActiveSection(section)}
              animate={{ width: "7em", height: "2em", backgroundColor: "#ffffff" }}
              transition={{ duration: .25 }}
            >
              <p>{section.charAt(0).toUpperCase() + section.slice(1)}</p>
            </motion.button>
          )
        ))}
      </div>
    </motion.div>
  );
}

type SectionContentProps = {
  section: "plan" | "track" | "analyze";
  onClose: () => void;
};

function SectionContent({ section, onClose }: SectionContentProps) {
  const getTitle = () => {
    if (section === "plan") return "Plan Your Workouts";
    if (section === "track") return "Track Your Runs";
    if (section === "analyze") return "Analyze Your Progress";
    return "";
  };

  return (
    <motion.div
      className={`relative z-10 section-content section-content-${section}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <button
        onClick={() => {
          console.log("Closed section, activeSection:", null);
          onClose();
        }}
        className="close absolute top-4 right-4 text-2xl text-white"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        X
      </button>
      <h1 className="section-heading font-bold">{getTitle()}</h1>
      {section === "plan" && <Calendar />}
      {section === "track" && <ShoeTracker />}
      {section === "analyze" && <Analyze/>}
    </motion.div>
  );
}

export default App;
