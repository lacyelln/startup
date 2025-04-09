import React, { useEffect, useState } from 'react';
import { ReadingEvent, WritingReadingNotifier } from '../person/postingNotifier'; // Import the WritingReadingNotifier

export function BookOfTheDay() {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=1&orderBy=newest'
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const bookData = data.items[0].volumeInfo;
          setBook({
            title: bookData.title,
            author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
            cover: bookData.imageLinks?.thumbnail || '',
            description: bookData.description || 'No description available.',
          });
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, []);

  return (
    <div>
      <h3>📖 Book of the Day:</h3>
      {book ? (
        <div>
          <h4>{book.title}</h4>
          <p>by {book.author}</p>
          {book.cover && <img src={book.cover} alt={book.title} />}
          <p>{book.description}</p>
        </div>
      ) : (
        <p>Loading book...</p>
      )}
    </div>
  );
}

// Books Component
export function Books() {
  const [myReviews, setMyReviews] = useState([]);
  const [otherReviews, setOtherReviews] = useState([]);
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // To send authentication cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username || 'Anonymous');
        } else {
          setErrorMessage('User not authenticated');
        }
      } catch (error) {
        setErrorMessage('Error fetching user info');
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch reviews for the logged-in user and other reviews
  useEffect(() => {
    if (!username) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reading', {
          method: 'GET',
          credentials: 'include', // To send authentication cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched reviews:', data); // Log the fetched reviews

          // Check if the response has reviews and filter based on username
          const userReviews = data.myReviews.filter((review) => review.user === username); // Match by username
          const otherReviews = data.otherReviews.filter((review) => review.user !== username); // Other users

          setMyReviews(userReviews);
          setOtherReviews(otherReviews);

          console.log('User Reviews:', userReviews);
          console.log('Other Reviews:', otherReviews);

          if (userReviews.length === 0 && otherReviews.length === 0) {
            setErrorMessage('No reviews found.');
          }
        } else {
          setErrorMessage('Failed to fetch reviews');
        }
      } catch (error) {
        setErrorMessage('Error fetching reviews');
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    // WebSocket event handler to listen for new reviews
    const handleWebSocketEvent = (event) => {
      if (event.type === WritingEvent.NewWriting) {
        // Update the reviews when a new writing event is received
        if (event.value.user === username) {
          setMyReviews((prev) => [...prev, event.value]); // Add to my reviews
        } else {
          setOtherReviews((prev) => [...prev, event.value]); // Add to other reviews
        }
      }
    };

    WritingReadingNotifier.addHandler(handleWebSocketEvent);

    // Cleanup WebSocket event handler on component unmount
    return () => {
      WritingReadingNotifier.removeHandler(handleWebSocketEvent);
    };
  }, [username]); // Re-run when username is available

  return (
    <main className="container-fluid body text-center">
      <div>
        <BookOfTheDay />
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display errors */}

      <h3>My Book Reviews</h3>
      {myReviews.length > 0 ? (
        myReviews.map((review, index) => (
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
            <h4>{review.title}</h4>
            <p>{review.review}</p>
            <label>Overall Rating: {review.rating}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={review.rating}
              readOnly
              style={{ width: '100%' }}
            />
          </div>
        ))
      ) : (
        <p>
          <i>No reviews yet. Submit one on the book review page!</i>
        </p>
      )}

      <h3>Browse Reviews</h3>
      {otherReviews.length > 0 ? (
        otherReviews.map((review, index) => (
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
            <h4>
              {review.title} - <small>by {review.user}</small>
            </h4>
            <p>{review.review}</p>
            <label>Overall Rating: {review.rating}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={review.rating}
              readOnly
              style={{ width: '100%' }}
            />
          </div>
        ))
      ) : (
        <p>
          <i>No other reviews available.</i>
        </p>
      )}
    </main>
  );
}
