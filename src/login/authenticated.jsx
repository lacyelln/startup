import React from 'react';
import { useNavigate } from 'react-router-dom';



export function Authenticated({ userName, onLogout }) {
  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}