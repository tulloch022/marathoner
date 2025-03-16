import { useState, useRef, useEffect } from "react";
import { signUp } from "../services/authService"; // Import the signUp function

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State to hold any error message
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the signUp function from authService
      const user = await signUp(email, password); 
      onClose(); // Close the form after successful sign up
    } catch (error) {
      // If there's an error, display the message
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  // Close signup form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={formRef} className="signup-popup">
      <form onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        {error && <div className="error">{error}</div>} {/* Display error message if any */}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
