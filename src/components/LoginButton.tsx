import { useState } from "react";
import LoginForm from "./LoginForm";

const LoginButton = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <button className="login-btn" onClick={() => setIsLoginOpen(true)}>
        Login
      </button>
      {isLoginOpen && <LoginForm onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default LoginButton;
