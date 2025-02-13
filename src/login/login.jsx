import React from 'react';

export function Login() {
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

      <form method="get" action="person.html">
        <div>
          <input type="text" placeholder="your@email.com" />
        </div>
        <div>
          <input type="password" placeholder="password" />
        </div>
        <button type="submit">Login</button>
        <button type="button">Create</button>
      </form>
    </main>
  );
}
