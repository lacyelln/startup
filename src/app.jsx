import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Books } from './reading/reading';
import { Writings } from './writing/writing';
import { Person } from './person/person';

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }

export default function App() {
    return (
        <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
        <div className="navbar-brand">
                The Writing Discussion<sup>&reg;</sup>
                </div>
                <menu className="navbar-nav">
                    <li className="nav-item">
                    <NavLink className="nav-link" to="">
                        Login
                    </NavLink>
                    </li>
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
            <Route path='/' element={<Login />} exact />
            <Route path='/books' element={<Books />} />
            <Route path='/writings' element={<Writings />} />
            <Route path='/person' element={<Person />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
  
        <footer>
          <p>Created by Lacy Miller</p>
          <a href="https://github.com/lacyelln/startup.git">My GitHub</a>
        </footer>
      </div>
      </BrowserRouter>
    );
}
  
