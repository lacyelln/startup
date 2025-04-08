import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.email || 'Anonymous');
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

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!username) {
      alert('You must be logged in to post writing!');
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('Please fill out both fields before uploading.');
      return;
    }

    const newWriting = { title, content, user: username };

    try {
      const response = await fetch('/api/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWriting),
        credentials: 'include',
      });

      if (response.ok) {
        // ✅ Send WebSocket message
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'new-writing', data: newWriting }));
        }

        setTitle('');
        setContent('');
        navigate('/writings');
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
      <form onSubmit={handleUpload}>
        <div>
          <textarea
            rows="1"
            cols="50"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            rows="5"
            cols="50"
            placeholder="Post your writing here..."
            style={{ width: '100%', height: '200px', overflowY: 'auto' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
