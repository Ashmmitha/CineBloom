import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();  
  return (
    <div>
      <button onClick={() => navigate("/profile")}>
        Profile 👤
      </button>
    </div>
  );
}

export default Navbar;