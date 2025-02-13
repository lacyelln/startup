import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Reading } from './reading/reading';
import { Writings } from './writing/writing';
import { Person } from './person/person';

function NotFound() {
  return <h2 className="text-center mt-5">404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark">
            <div className="navbar-brand">
              The Writing Discussion<sup>&reg;</sup>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/books">Books</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/writings">Writings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/post">Post</NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <main className="container mt-5">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/books" element={<Reading />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/post" element={<Person />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="text-center mt-4">
          <p>Created by Lacy Miller</p>
          <a href="https://github.com/lacyelln/startup.git">My GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}
