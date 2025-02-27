import { useState, useRef, useEffect } from "react";
import { signIn } from "../services/authService"; // Import the signIn function from authService

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // To handle error messages
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the signIn function from authService to log in the user
      const user = await signIn(username, password); // Passing username (email) and password to Firebase
      console.log("User logged in:", user); // You can use this to handle the logged-in user (e.g., redirect)
      onClose(); // Close the form after successful login
    } catch (error) {
      // Handle any error that occurs during login (e.g., incorrect credentials)
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  // Close login form when clicking outside
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
    <div ref={formRef} className="login-popup">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        {error && <div className="error">{error}</div>} {/* Display error message if any */}
        <input
          type="text"
          placeholder="Username (Email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

