import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();


  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      setUser && setUser(currentUser);
      navigate("/home");
    }
  }, [navigate, setUser]);


  const handleLogin = () => {

    if (!name || !email || !password) {
      alert("💖 Fill all fields!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("❌ Please enter a valid email.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (!storedUser) {
      alert("⚠️ No user found. Please sign up first.");
      return;
    }

    if (
      storedUser.username !== name ||
      storedUser.email !== email
    ) {
      alert("⚠️ Wrong username or email.");
      return;
    }

    if (storedUser.password !== password) {
      alert("❌ Password incorrect.");
      return;
    }

  
    localStorage.setItem("currentUser", storedUser.username);
    setUser && setUser(storedUser.username);

    navigate("/home");
  };

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="login-box">

        <h1>Welcome 💖</h1>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleLogin}>Login</button>

        <button
          className="landing-btn"
          onClick={() => navigate("/")}
        >
          🏠 Go Back
        </button>

        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

      </div>
    </div>
  );
}

export default Login;