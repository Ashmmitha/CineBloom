import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("dark"); // default dark

  // Initialize tsparticles
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const toggleMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <div className={`landing-container ${mode}`}>
      {/* Animated particles */}
      <Particles
        className="particles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          particles: {
            color: { value: mode === "dark" ? "#e50914" : "#ff69b4" },
            links: { enable: false },
            move: { direction: "none", enable: true, speed: 0.3, outModes: "bounce" },
            number: { value: 80 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      {/* Overlay content */}
      <div className="overlay">
        <h1 className="title">🎬 CineBloom</h1>
        <p className="tagline">Your personal movie universe</p>

        <div className="buttons">
          <button className="btn login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn signup" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        <button className="toggle-mode" onClick={toggleMode}>
          {mode === "dark" ? "Switch to Light Mode 🌸" : "Switch to Dark Mode 🌌"}
        </button>
      </div>
    </div>
  );
}

export default Landing;