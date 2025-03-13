import React from 'react';
import { MessageDialog } from './messageDialog';
import { useNavigate } from 'react-router-dom';
//import { loginUser as apiLoginUser, createUser as apiCreateUser, logoutUser } from '../../service/index.js';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login(props) {
  const authState = props.authState;
  const onAuthChange = props.onAuthChange;
  const [userName, setUserName] = React.useState(props.userName || '');

  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  
  const navigate = useNavigate();
  
  async function loginUser() {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userName, password: password}),
      });
  
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.msg || 'Login failed');
      }
  
      onAuthChange(userName, AuthState.Authenticated);
      navigate('/person');
    } catch (error) {
      setDisplayError(`⚠ Error: ${error.message}`);
    }
  }

  async function createUser() {
    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userName, password: password}),
      });
  
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.msg);
      }
  
      onAuthChange(userName, AuthState.Authenticated);
      navigate('/person');
    } catch (error) {
      setDisplayError(`⚠ Error: ${error.message}`);
    }
  }
  
  
  
  return (
    <main className="container-fluid body text-center">
      <h1>Welcome to The Writing Discussion</h1>
      <img
        src="https://i.pinimg.com/originals/a4/0a/aa/a40aaa98dcb170a17896485105401908.jpg"
        className="animated-image"
        alt="Writing theme"
      />

      <p>
        This website allows you to share your own writings with friends and family. It's also a great way to stay updated on the most popular books with their reviews.
      </p>
      <p>Login or create an account with us to get started in on all the fun!</p>
      <div>
          <input type="text" name="email" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="your@email.com" required />
        </div>
        <div>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" required />
        </div>
        <button variant='primary' onClick={() => loginUser()} disabled={!userName || !password}>
          Login
        </button>
        <button variant='secondary' onClick={() => createUser()} disabled={!userName || !password}>
          Create
        </button>
        <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    
        

      <div>
        {authState !== AuthState.Unknown}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}