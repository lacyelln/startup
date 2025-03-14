import React from 'react';
import { MessageDialog } from './messageDialog';
import { useNavigate } from 'react-router-dom';
import { Unauthenticated } from './unauthenticated';
import { AuthState } from './authState';

export function Login(props) {
  const { authState, onAuthChange } = props;
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
        body: JSON.stringify({ email: userName, password: password }),
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
        body: JSON.stringify({ email: userName, password: password }),
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
      {/* LOGOUT BUTTON (ONLY VISIBLE WHEN AUTHENTICATED) */}


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

      {/* SHOW LOGIN FORM ONLY IF NOT AUTHENTICATED */}
      {authState === AuthState.Unauthenticated && (
        <>
          <div>
            <input
              type="text"
              name="email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          <button className="primary-button" onClick={loginUser} disabled={!userName || !password}>
            Login
          </button>
          <button className="secondary-button" onClick={createUser} disabled={!userName || !password}>
            Create Account
          </button>
        </>
      )}

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </main>
  );
}
