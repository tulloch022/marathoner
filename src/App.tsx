import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton.tsx";

function App() {
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scale = 1 + scrollY / 350; // Adjust the divisor to control speed of scaling
      const opacity = Math.max(1 - scrollY / 500, 0); // Adjust the opacity based on scroll position

      const title = document.querySelector(".title") as HTMLElement;
      const subtitle = document.querySelector(".subtitle") as HTMLElement;
      const content = document.querySelector(".content");

      // Apply styles dynamically based on scroll position
      if (title) {
        title.style.transform = `scale(${scale})`;
        title.style.opacity = `${opacity}`;
      }
      if (subtitle) {
        subtitle.style.transform = `scale(${scale})`;
        subtitle.style.opacity = `${opacity}`;
      }

      // Show the content when the title fades out (opacity <= 0)
      if (content) {
        if (opacity <= 0) {
          setIsContentVisible(true); // Show content when title fades out
        } else {
          setIsContentVisible(false); // Hide content when title is still visible
        }
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

      <h1 className="title">Marathoner.</h1>
      <p className="subtitle">Welcome to your training companion</p>


      {/* Scroll Down Arrow */}
      <div className="scroll-arrow">
        <span>&#8595;</span> {/* Unicode for downward arrow */}
      </div>

      {/* Box Container with Three Boxes Side by Side */}
      <div className={`box-container ${isContentVisible ? "visible" : ""}`}>
        <div className="box-under-arrow">
          <p>Plan</p>
        </div>
        <div className="box-under-arrow">
          <p>Track</p>
        </div>
        <div className="box-under-arrow">
          <p>Analyze</p>
        </div>
      </div>

            {/* Table Section */}
      <div className="table-container">
        <table className="feature-table">
          <tbody>
            <tr>
              <td>Plan</td>
              <td>Create and customize your marathon training schedule.</td>
            </tr>
            <tr>
              <td>Track</td>
              <td>Monitor your progress with detailed performance metrics.</td>
            </tr>
            <tr>
              <td>Analyze</td>
              <td>Review your performance and identify areas for improvement.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
