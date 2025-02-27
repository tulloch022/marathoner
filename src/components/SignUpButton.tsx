import { useState } from "react";
import SignUpForm from "./SignUpForm.tsx";

const SignUpButton = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="signup-wrapper">
      <button className="signup-btn" onClick={() => setIsSignUpOpen(!isSignUpOpen)}>
        Sign Up
      </button>
      {isSignUpOpen && <SignUpForm onClose={() => setIsSignUpOpen(false)} />}
    </div>
  );
};

export default SignUpButton;
