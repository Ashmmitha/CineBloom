import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState("Guest");
  const [email, setEmail] = useState("guest@mail.com");
  const [darkMode, setDarkMode] = useState(true);

  const [currentlyWatching, setCurrentlyWatching] = useState(() => {
    const saved = localStorage.getItem("continueWatching");
    return saved ? JSON.parse(saved) : [];
  });

  // Stats
  const [stats, setStats] = useState(() => {
    const savedStats = JSON.parse(localStorage.getItem("userStats"));
    return savedStats || {
      myList: 2,
      trailersWatched: 5,
      hoursWatched: 3,
    };
  });

  // Auto-update currently watching from localStorage
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("continueWatching");
      setCurrentlyWatching(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Get user info
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("userData"));
    if (u && u.username) {
      setUser(u.username);
      setEmail(u.email);
    }
  }, []);

  // TOTAL TRAILERS / HOURS WATCHED CALC
  const totalTrailers = currentlyWatching.length;
  const totalHours = currentlyWatching.reduce((acc, item) => acc + (item.duration || 2), 0); // default 2 hrs if no duration

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : "light-mode"}`}>

      {/* Toggle */}
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Avatar */}
      <div className="avatar-section">
        <div className="avatar">{user[0]?.toUpperCase()}</div>
        <h2 className="username">{user}</h2>
        <p className="email">{email}</p>
        <p className="bio">“Movies are my therapy.” 🎬</p>
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>My List</h3>
          <p>{stats.myList}</p>
        </div>

        <div className="stat-card current-watch-card">
          <h3>🎬 Currently Watching</h3>
          {currentlyWatching.length > 0 ? (
            <div className="scroll-wrapper">
              <div className="scroll-row">
                {currentlyWatching.map((movie) => (
                  <div className="scroll-card" key={movie.id}>
                    <Card item={movie} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No shows currently being watched 😅</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Trailers Watched</h3>
          <p>{totalTrailers}</p>
        </div>

        <div className="stat-card">
          <h3>Hours Watched</h3>
          <p>{totalHours}</p>
        </div>
      </div>

      {/* Back button */}
      <button className="home-button" onClick={() => navigate("/home")}>
        ⬅ Back to Home
      </button>
    </div>
  );
}

export default Profile;