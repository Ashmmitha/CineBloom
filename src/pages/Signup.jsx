import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup({ setUser }) {

  const [username, setUsername] = useState("");
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
const [passwordError, setPasswordError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
   const validateEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

const getPasswordStrength = (password) => {
  if (password.length < 8) return "Weak";

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  if (password.length >= 10 && hasLetters && hasNumbers && hasSpecial) {
    return "Strong";
  }

  if (password.length >= 10 && hasLetters && hasNumbers) {
    return "Medium";
  }

  return "Weak";
};




  const handleSignup = () => {


    if (!username || !emailOrNumber || !password) {
      alert("Fill all fields! 💖");
      return;
    }


    if (!validateEmail(emailOrNumber)) {
      setEmailError("⚠️ Invalid email format");
      return;
    }

    if (password.length < 10) {
      setPasswordError("⚠️ Password must be at least 10 characters");
      return;
    }

    
    localStorage.setItem(
      "userData",
      JSON.stringify({ username, email: emailOrNumber, password })
    );

    localStorage.setItem("currentUser", username);

    if (setUser) setUser(username);

    navigate("/home");
  };

return (
<div className={`signup-container ${darkMode ? "dark-mode" : "light-mode"}`}>
  {/* DARK MODE TOGGLE — TOP RIGHT */}
  <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
  </button>

  {/* SIGNUP CARD */}
  <div className="signup-box">
    <h1>Sign Up 💖</h1>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="text"
      placeholder="Email"
      value={emailOrNumber}
      onChange={(e) => setEmailOrNumber(e.target.value)}
    />
{emailError && <p className="error-text">{emailError}</p>}
    <input
      type="password"
      placeholder="Password (min 10 characters)"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleSignup}>Sign Up</button>

    <p className="switch-auth">
      Already have an account?
      <span onClick={() => navigate("/login")}> Login</span>
    </p>
  </div>
</div>
);
}

export default Signup;