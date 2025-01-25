import { useEffect, useState, useRef } from "react";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx"
import Subtitle from "./components/Subtitle.tsx"
import ScrollDownArrow from "./components/ScrollDownArrow.tsx"
import Calendar from "./components/Calendar.tsx"
import SignUpButton from "./components/SignUpButton.tsx"

function App() {
  const [isContentVisible] = useState(false);


  const calendarRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the Calendar
  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scale = 1 + scrollY / 350; // Adjust the divisor to control speed of scaling
      const opacity = Math.max(1 - scrollY / 500, 0); // Adjust the opacity based on scroll position

      const title = document.querySelector(".title") as HTMLElement;
      const subtitle = document.querySelector(".subtitle") as HTMLElement;

      // Apply styles dynamically based on scroll position
      if (title) {
        title.style.transform = `scale(${scale})`;
        title.style.opacity = `${opacity}`;
      }
      if (subtitle) {
        subtitle.style.transform = `scale(${scale})`
        subtitle.style.opacity = `${opacity}`;
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="main">
      

      {/* Login Button */}
      
      <LoginButton />
      <SignUpButton />
      <Title />
      <Subtitle />
      <ScrollDownArrow />
    
      <div className="calendar-container" ref={calendarRef}>
      <Calendar />
      </div>

      {/* Box Container with Three Boxes Side by Side */}
      <div className={`box-container ${isContentVisible ? "visible" : ""}`}>
      <button className="box-under-arrow" onClick={scrollToCalendar}>
          <p>Plan</p>
        </button>
        <button className="box-under-arrow">
          <p>Track</p>
        </button>
        <button className="box-under-arrow">
          <p>Analyze</p>
        </button>
      </div>

            {/* Table Section */}
      <div className="table-container">
        <table className="feature-table">
          <tbody>
            <tr>
              <td className="heading">Plan</td>
              <td>Create and customize your marathon training schedule.</td>
            </tr>
            <tr>
              <td className="heading">Track</td>
              <td>Monitor your progress with detailed performance metrics.</td>
            </tr>
            <tr>
              <td className="heading">Analyze</td>
              <td>Review your performance and identify areas for improvement.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
