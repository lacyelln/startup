import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState(''); // Store logged-in user's email
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's information
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username || 'Anonymous'); // Store user's email
        } else {
          console.error('User not authenticated');
          navigate('/login'); // Redirect to login page if not authenticated
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        navigate('/login'); // Redirect to login if there is an error fetching user data
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in before posting
    if (!username) {
      alert('You must be logged in to post writing!');
      navigate('/login');
      return;
    }

    // Check if title and content are provided
    if (!title.trim() || !content.trim()) {
      alert('Please fill out both fields before uploading.');
      return;
    }

    // Construct the new writing object with the logged-in user's email
    const newWriting = { title, content, user: username };

    try {
      const response = await fetch('/api/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWriting),
        credentials: 'include', // Include authentication cookies in the request
      });

      if (response.ok) {
        setTitle(''); // Reset title field after successful submission
        setContent(''); // Reset content field after successful submission
        navigate('/writings'); // Navigate to writings page after successful post
      } else {
        console.error('Failed to upload writing');
        alert('Failed to upload writing. Please try again later.');
      }
    } catch (error) {
      console.error('Error uploading writing:', error);
      alert('There was an error uploading your writing. Please try again.');
    }
  };

  return (
    <div>
      <h3>Post your writing:</h3>
      <textarea 
        rows="1" 
        cols="50" 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        rows="5" 
        cols="50" 
        placeholder="Post your writing here..." 
        style={{ width: '100%', height: '200px', overflowY: 'auto' }} 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <button type="submit" onClick={handleUpload}>Upload</button>
    </div>
  );
}