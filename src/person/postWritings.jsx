import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('Anonymous'); // Default to anonymous
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's information
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // Include authentication cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username || 'Anonymous'); // Set username if available
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill out both fields before uploading.');
      return;
    }

    const newWriting = { title, content, user: username }; // Attach the username

    try {
      const response = await fetch('/api/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWriting),
        credentials: 'include',
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        navigate('/writings');
      } else {
        console.error('Failed to upload writing');
      }
    } catch (error) {
      console.error('Error uploading writing:', error);
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
