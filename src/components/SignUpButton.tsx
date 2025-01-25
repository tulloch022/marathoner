function SignUpButton() {
    const handleClick = () => {
      // Logic for login action can go here (e.g., show a login modal, navigate to a login page, etc.)
      console.log("Sign Up button clicked!");
    };
  
    return (
      <button className="signup-btn" onClick={handleClick}>
        Sign Up
      </button>
    );
  }
  
  export default SignUpButton;
  