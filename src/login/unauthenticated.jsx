import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';


export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }
  
  

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
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
        <Button variant='primary' onClick={() => loginUser()} disabled={!userName || !password}>
          Login
        </Button>
        <Button variant='secondary' onClick={() => createUser()} disabled={!userName || !password}>
          Create
        </Button>
        <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    
    
    </main>
  );
}
