import { useEffect, useRef } from "react";
import LoginButton from "./components/LoginButton.tsx";
import Title from "./components/Title.tsx"
import Subtitle from "./components/Subtitle.tsx"
import ScrollDownArrow from "./components/ScrollDownArrow.tsx"
import Calendar from "./components/Calendar.tsx"
import SignUpButton from "./components/SignUpButton.tsx"
import RunTracker from "./components/ShoeTracker.tsx"

function App() {

  return (
    <div className="main">
      

      {/* Login Button */}
      
      <LoginButton />
      <SignUpButton />
      <Title />
      <Subtitle />
      <ScrollDownArrow />
  

      {/* Box Container with Three Boxes Side by Side */}
      <div className='box-container'>
      <button className="box-under-arrow" onClick={'ok'}>
          <p>Plan</p>
        </button>
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

export default App;
