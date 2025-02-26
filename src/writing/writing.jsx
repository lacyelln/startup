import React, { useEffect, useState } from 'react';

export function Writings() {
  const [writings, setWritings] = useState([]); // State for storing writings

  useEffect(() => {
    const storedWritings = JSON.parse(localStorage.getItem('writings')) || [];
    setWritings(storedWritings);
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
            <h4>{writing.title}</h4>
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

      <h3>Browse</h3>
      <div
        style={{
          border: '1px solid #c5b1a2',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: '20px',
          backgroundColor: '#fbfbdd',
        }}
      >
        <label htmlFor="essay-little-red">Little Red Riding Hood:</label>
        <textarea
          id="essay-little-red"
          name="essay"
          rows="10"
          cols="50"
          defaultValue={`Once upon a time there was a dear little girl who was loved by every one who looked at her...`}
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

      <div
        style={{
          border: '1px solid #c5b1a2',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: '20px',
          backgroundColor: '#fbfbdd',
        }}
      >
        <label htmlFor="essay-goldilocks">Goldilocks and the Three Bears:</label>
        <textarea
          id="essay-goldilocks"
          name="essay"
          rows="10"
          cols="50"
          defaultValue={`Once upon a time there were three Bears, who lived together in a house of their own...`}
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
    </main>
  );
}
