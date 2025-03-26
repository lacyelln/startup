import React, { useEffect, useState } from 'react';

export function Writings() {
  const [writings, setWritings] = useState([]);
  const [username, setUsername] = useState('');
  const [myWritings, setMyWritings] = useState([]);
  const [otherWritings, setOtherWritings] = useState([]);

  useEffect(() => {
    const fetchUserAndWritings = async () => {
      try {
        // Fetch the logged-in user's information
        const userResponse = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (!userResponse.ok) throw new Error('User not authenticated');
        const userData = await userResponse.json();
        setUsername(userData.username);

        // Fetch all writings
        const writingsResponse = await fetch('/api/writing', {
          method: 'GET',
          credentials: 'include',
        });
        if (!writingsResponse.ok) throw new Error('Failed to fetch writings');
        const writingsData = await writingsResponse.json();

        // Separate writings into my writings and others
        const userWritings = writingsData.myWritings.filter(writing => writing.user === userData.username);
        const otherUsersWritings = writingsData.otherWritings.filter(writing => writing.user !== userData.username);

        setMyWritings(userWritings);
        setOtherWritings(otherUsersWritings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserAndWritings();
  }, []);

  return (
    <main className="container-fluid body text-center">
      <h3>My Writings</h3>
      {myWritings.length > 0 ? (
        myWritings.map((writing, index) => (
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
        <p><i>No writings yet. Submit one on the writing page!</i></p>
      )}

      <h3>Browse Writings</h3>
      {otherWritings.length > 0 ? (
        otherWritings.map((writing, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '20px',
              backgroundColor: '#f1f1f1',
            }}
          >
            <h4>{writing.title} - <small>by {writing.user}</small></h4>
            <textarea
              rows="10"
              cols="50"
              value={writing.content}
              readOnly
              style={{
                width: '100%',
                backgroundColor: '#f1f1f1',
                color: '#333',
                border: 'none',
                resize: 'none',
              }}
            />
          </div>
        ))
      ) : (
        <p><i>No other writings available.</i></p>
      )}
    </main>
  );
}