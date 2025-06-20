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
        {(["plan", "track", "analyze"] as const).map((section) => (
                  <motion.button
                    key={section}
                    className="box-under-arrow"
                    initial={{ width: "50vw", height: "3em" }}
                    onClick={() => {
                      if (activeSection !== section) {
                        setActiveSection(section);
                      }
                    }}
                    animate={{
                      width: activeSection === section ? "100vw" : "7em",
                      height: activeSection === section ? "100vh" : "2em",
                      backgroundColor: activeSection === section ? "white" : "#ffffff",
                      border: activeSection === section ? "none" : "",
                      boxShadow: activeSection === section ? "none" : "",
                    }}
                    transition={{ duration: .25 }}
                    style={{
                      overflow: "hidden",
                      position: "relative",
                      zIndex: 1,
                      cursor: activeSection === section ? "default" : "pointer",
                    }}
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
      className="relative z-10"
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
