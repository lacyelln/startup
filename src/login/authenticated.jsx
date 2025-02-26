import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';


export function Authenticated(props) {

  function logout() {
    localStorage.removeItem('userName');
    props.onLogout();
  }
}