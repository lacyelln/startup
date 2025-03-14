import { useNavigate } from 'react-router-dom';
import React from "react";

export function LogoutButton({ userName, onLogout }) {
  if (!userName) return null; // Only show if user is logged in

  return (
    <div className="logout-container">
      <span className="welcome-text">Welcome, {userName}!</span>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
}

