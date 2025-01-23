function LoginButton() {
  const handleClick = () => {
    // Logic for login action can go here (e.g., show a login modal, navigate to a login page, etc.)
    console.log("Login button clicked!");
  };

  return (
    <button className="login-btn" onClick={handleClick}>
      Login
    </button>
  );
}

export default LoginButton;
