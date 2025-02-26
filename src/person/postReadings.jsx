import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostReview() {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/books');
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
        onChange={(e) => setRating(e.target.value)} 
      />
      <br />
      <button type="submit" onClick={handleSubmit}>Submit rating</button>
    </div>
  );
}
