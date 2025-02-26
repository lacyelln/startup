import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {

  function logout() {
    localStorage.removeItem('userName');
    props.onLogout();
  }
}