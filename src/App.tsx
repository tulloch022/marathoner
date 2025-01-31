import { useState } from "react";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx";
import Subtitle from "./components/Subtitle.tsx";
import Calendar from "./components/Calendar.tsx";
import SignUpButton from "./components/SignUpButton.tsx";
import ShoeTracker from "./components/ShoeTracker.tsx";
import { motion } from "framer-motion";

function App() {
  const [activeSection, setActiveSection] = useState<"plan" | "track" | "analyze" | null>(null);

  return (
    <div className="main flex flex-col items-center justify-center h-screen">
      {/* Login & Signup Buttons - These will be hidden when a section is active */}
      {!activeSection && (
        <>
          <LoginButton />
          <SignUpButton />
          <Title />
          <Subtitle />
        </>
      )}

      {/* Main Buttons - Hide other buttons when a section is active */}
      <div className="box-container flex gap-4 relative">
        {["plan", "track", "analyze"].map((section) =>
          activeSection === null || activeSection === section ? ( // Only show the active or null section
            <motion.button
              key={section}
              className="box-under-arrow"
              onClick={() => setActiveSection(section as "plan" | "track" | "analyze")}
              animate={
                activeSection === section
                  ? { width: "80vw", height: "100vh" }
                  : { width: "10vw", height: "100%" } // Default size when not active
              }
              
              style={{ overflow: "hidden", position: "relative", zIndex: 1 }}
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
    <div className="relative z-10">
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 text-2xl">X</button>
      <h1 className="text-3xl font-bold">
        {section === "plan"}
        {section === "track" && "Track Your Progress"}
        {section === "analyze" && "Analyze Your Progress"}
      </h1>
      {section === "plan" && <Calendar />}
      {section === "track" && <ShoeTracker />}
      {section === "analyze" && <div> {/* Add analysis content here */} </div>}
    </div>
  );
}

export default App;
