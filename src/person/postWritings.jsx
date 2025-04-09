import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WritingEvent, WritingReadingNotifier } from './postingNotifier'; // Import the WritingReadingNotifier

export function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [events, setEvents] = useState([]); // State to track events from WebSocket
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Establish WebSocket connection and listen for events
  useEffect(() => {
    // Fetch user info
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

    // WebSocket setup
    let port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data.text());
        WritingReadingNotifier.receiveEvent(event); // Pass incoming events to WritingReadingNotifier
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Add event handler to listen for new writings
    const handleWebSocketEvent = (event) => {
      if (event.type === WritingEvent.NewWriting) {
        setEvents((prevEvents) => [...prevEvents, event]); // Update state with new event (new writing)
      }
    };

    WritingReadingNotifier.addHandler(handleWebSocketEvent);

    // Cleanup WebSocket event handler on component unmount
    return () => {
      WritingReadingNotifier.removeHandler(handleWebSocketEvent);
    };
  }, [navigate]);

  // Handle form submission (posting new writing)
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
        // Send WebSocket message
        WritingReadingNotifier.broadcastEvent(username, WritingEvent.NewWriting, newWriting);

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

  // Render the list of events (new writings)
  function createMessageArray() {
    const messageArray = [];
    for (const [i, event] of events.entries()) {
      let message = 'unknown';
      if (event.type === WritingEvent.NewWriting) {
        message = `${event.value.user} posted new writing: "${event.value.title}"`;
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

      <div id="player-messages">
        {createMessageArray()} {/* Render the list of events (new writings) */}
      </div>
    </div>
  );
}
