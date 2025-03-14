import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Books } from './reading/reading';
import { Writings } from './writing/writing';
import { Person } from './person/person';
import { AuthState } from './login/authState';

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  function handleLogout() {
    setUserName('');
    setAuthState(AuthState.Unauthenticated);
    localStorage.removeItem('userName'); 
    window.location.href = '/'; 
  }

  return (
    <div className="body bg-dark text-light">
      <BrowserRouter>
        <header className="header-container">
          <div className="navbar-brand">
            The Writing Discussion<sup>&reg;</sup>
          </div>

          <menu className="navbar-nav">
            {!userName ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="">
                  Login
                </NavLink>
              </li>
            ) : null}

            <li className="nav-item">
              <NavLink className="nav-link" to="books">
                Books
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="writings">
                Writings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="person">
                Post
              </NavLink>
            </li>
          </menu>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                  localStorage.setItem('userName', userName);
                }}
              />
            }
            exact
          />
          <Route path="/books" element={<Books />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/person" element={<Person />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      
        {userName && (
          <div className="footer-container">
            <p className="welcome-text">Welcome, {userName}!</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <footer>
          <p>Created by Lacy Miller</p>
          <a href="https://github.com/lacyelln/startup.git">My GitHub</a>
        </footer>
      </BrowserRouter>
    </div>
  );
}