import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser"); // match what you used in signup
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <Router basename="/CineBloom"> {/* <- wrap all routes here */}
      <Routes>
        {/* Landing page always first */}
        <Route path="/" element={<Landing />} />

        {/* Login/Signup pages */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;