import React, { useEffect, useState } from 'react';

export function Writings() {
  const [writings, setWritings] = useState([]);

  useEffect(() => {
    const fetchWritings = async () => {
      try {
        const response = await fetch('/api/writing', {
          method: 'GET',
          credentials: 'include', // To send authentication cookies
        });
        if (response.ok) {
          const data = await response.json();
          setWritings(data);
        } else {
          console.error('Failed to fetch writings');
        }
      } catch (error) {
        console.error('Error fetching writings:', error);
      }
    };

    fetchWritings();
  }, []);

  return (
    <main className="container-fluid body text-center">
      <h3>My Writings</h3>
      {writings.length > 0 ? (
        writings.map((writing, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #c5b1a2',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '20px',
              backgroundColor: '#fbfbdd',
            }}
          >
            <h4>{writing.title} - <i>{writing.user || 'Anonymous'}</i></h4>
            <textarea
              rows="10"
              cols="50"
              value={writing.content}
              readOnly
              style={{
                width: '100%',
                backgroundColor: '#fbfbdd',
                color: '#3E2723',
                border: 'none',
                resize: 'none',
              }}
            />
          </div>
        ))
      ) : (
        <p>
          <i>No writings yet. Submit one on the writing page!</i>
        </p>
      )}
    </main>
  );
}
