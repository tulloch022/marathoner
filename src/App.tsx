import React, { useEffect, useState } from "react";

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
      <h1 className="title">Marathoner.</h1>
      <p className="subtitle">Welcome to your training companion</p>


      {/* Scroll Down Arrow */}
      <div className="scroll-arrow">
        <span>&#8595;</span> {/* Unicode for downward arrow */}
      </div>

      {/* Box under the arrow */}
      <div className="box-under-arrow">
        <p>This is the box under the arrow.</p>
      </div>
    </div>
    
  );
}


export default App;
