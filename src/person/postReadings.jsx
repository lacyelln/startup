import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostReview() {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [username, setUsername] = useState('');
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Establish WebSocket connection
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Fetch the logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username || 'Anonymous');
        } else {
          console.error('User not authenticated');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !review) {
      alert('Please fill out both the title and review.');
      return;
    }

    const newReview = {
      title,
      review,
      rating: Number(rating),
      user: username,
    };

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
        credentials: 'include',
      });

      if (response.ok) {
        // ✅ Send the new review via WebSocket
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'new-review', data: newReview }));
        }

        setTitle('');
        setReview('');
        setRating(5);
        navigate('/books');
      } else {
        console.error('Failed to submit review');
        alert('Failed to submit review. Try again later.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Check console for details.');
    }
  };

  return (
    <div>
      <h3>Post a book review:</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="1"
          cols="50"
          placeholder="Title of book"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="5"
          cols="50"
          placeholder="Write your thoughts here..."
          style={{ width: '100%', height: '200px', overflowY: 'auto' }}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <label htmlFor="rating">Overall Rating:</label>
        <input
          type="range"
          id="rating"
          name="rating"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <br />
        <button type="submit">Submit rating</button>
      </form>
    </div>
  );
}
