import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WritingEvent, WritingReadingNotifier } from './postingNotifier'; // Import the WritingReadingNotifier

export function PostReview() {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [username, setUsername] = useState('');
  const [events, setEvents] = useState([]); // State to track events from WebSocket
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
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

    // Add event handler for WebSocket
    const handleWebSocketEvent = (event) => {
      // Handle different types of events (new review, etc.)
      if (event.type === WritingEvent.NewWriting) {
        setEvents((prevEvents) => [...prevEvents, event]);
      }
    };

    WritingReadingNotifier.addHandler(handleWebSocketEvent);

    // Cleanup WebSocket event handler on component unmount
    return () => {
      WritingReadingNotifier.removeHandler(handleWebSocketEvent);
    };
  }, [navigate]);

  // Handle form submission (posting a new review)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !review) {
      alert('Please fill out both the title and review.');
      return;
    }

    const newReview = { title, review, rating: Number(rating), user: username };

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
        credentials: 'include',
      });

      if (response.ok) {
        // Send the new review via WebSocket
        WritingReadingNotifier.broadcastEvent(username, WritingEvent.NewWriting, newReview);

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

  // Render the list of events (reviews)
  function createMessageArray() {
    const messageArray = [];
    for (const [i, event] of events.entries()) {
      let message = 'unknown';
      if (event.type === WritingEvent.NewWriting) {
        message = `${event.value.user} posted a new review: "${event.value.title}"`;
      } else if (event.type === WritingEvent.System) {
        message = event.value.msg;
      }

      messageArray.push(
        <div key={i} className="event">
          <span className={'player-event'}>{event.from}</span>
          {message}
        </div>
      );
    }
    return messageArray;
  }

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

      <div id="player-messages">
        {createMessageArray()} {/* Render the list of events (new reviews) */}
      </div>
    </div>
  );
}
