import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LoginButton from "./components/LoginButton";
import Title from "./components/Title";
import Subtitle from "./components/Subtitle";
import Calendar from "./components/Calendar";
import SignUpButton from "./components/SignUpButton";
import ShoeTracker from "./components/ShoeTracker";
import Analyze from "./components/Analyze";
import { useAuth } from "./auth/useAuth";

const sections = [
  { id: "plan", label: "Plan", title: "Plan Your Workouts" },
  { id: "track", label: "Track", title: "Track Your Runs" },
  { id: "analyze", label: "Analyze", title: "Analyze Your Progress" },
] as const;

type Section = (typeof sections)[number]["id"];

function App() {
  const auth = useAuth();
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const lastActiveSection = useRef<Section | null>(null);
  const triggerRefs = useRef<Record<Section, HTMLButtonElement | null>>({
    plan: null,
    track: null,
    analyze: null,
  });

  useEffect(() => {
    if (!activeSection && lastActiveSection.current) {
      triggerRefs.current[lastActiveSection.current]?.focus();
      lastActiveSection.current = null;
    }
  }, [activeSection]);

  useEffect(() => {
    if (auth.status !== "signedIn") {
      setActiveSection(null);
      setLogoutError(null);
    }
  }, [auth.status]);

  const openSection = (section: Section) => {
    lastActiveSection.current = section;
    setActiveSection(section);
  };

  const closeSection = () => {
    setActiveSection(null);
  };

  const handleLogout = async () => {
    setLogoutError(null);

    try {
      await auth.logout();
    } catch {
      setLogoutError("We couldn't log you out. Please try again.");
    }
  };

  const activeSectionDetails = sections.find(({ id }) => id === activeSection);

  return (
    <motion.div
      className="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {auth.status === "loading" && (
        <>
          <Title />
          <p className="auth-message" role="status">
            Loading your session...
          </p>
        </>
      )}

      {auth.status !== "loading" && !activeSection && (
        <>
          {auth.status === "signedOut" ? (
            <>
              <LoginButton />
              <SignUpButton />
            </>
          ) : (
            <div className="session-controls">
              <p className="session-user">
                Signed in as {auth.user.email ?? "Marathoner user"}
              </p>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
          <Title />
          <Subtitle />
          {auth.status === "signedOut" && (
            <p className="auth-message">
              Sign in or create an account to access your training plan, run
              tracker, and progress.
            </p>
          )}
          {logoutError && (
            <p className="auth-message auth-error" role="alert">
              {logoutError}
            </p>
          )}
        </>
      )}

      {auth.status === "signedIn" && !activeSection && (
        <nav className="section-navigation" aria-label="Training sections">
          {sections.map(({ id, label }) => (
            <motion.button
              key={id}
              ref={(element) => {
                triggerRefs.current[id] = element;
              }}
              type="button"
              className="section-trigger"
              aria-controls={`${id}-panel`}
              aria-expanded="false"
              onClick={() => openSection(id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {label}
            </motion.button>
          ))}
        </nav>
      )}

      {auth.status === "signedIn" && activeSection && activeSectionDetails && (
        <motion.section
          id={`${activeSection}-panel`}
          className="section-panel"
          aria-labelledby={`${activeSection}-panel-title`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeSection();
          }}
        >
          <SectionContent
            section={activeSection}
            title={activeSectionDetails.title}
            onClose={closeSection}
          />
        </motion.section>
      )}
    </motion.div>
  );
}

type SectionContentProps = {
  section: Section;
  title: string;
  onClose: () => void;
};

function SectionContent({ section, title, onClose }: SectionContentProps) {
  return (
    <motion.div
      className="section-panel-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={onClose}
        className="close"
        aria-label={`Close ${title} panel`}
        autoFocus
      >
        <span aria-hidden="true">X</span>
      </button>
      <h1 id={`${section}-panel-title`} className="section-heading">{title}</h1>
      {section === "plan" && <Calendar />}
      {section === "track" && <ShoeTracker />}
      {section === "analyze" && <Analyze />}
    </motion.div>
  );
}

export default App;
