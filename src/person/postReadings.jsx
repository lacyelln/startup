import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostReview() {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = { title, review, rating: Number(rating), user: "Anonymous" }; // Replace with actual user
  
    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
        credentials: 'include', // Ensures auth cookies are sent
      });

      if (response.ok) {
        setTitle('');
        setReview('');
        setRating(5);
        navigate('/books');
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      <h3>Post a book review:</h3>
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
      <button type="submit" onClick={handleSubmit}>Submit rating</button>
    </div>
  );
}

