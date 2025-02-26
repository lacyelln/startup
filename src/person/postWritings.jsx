import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill out both fields before uploading.');
      return;
    }

    localStorage.setItem('postTitle', title);
    localStorage.setItem('postContent', content);

    setTitle('');
    setContent('');

    navigate('/writings');
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
