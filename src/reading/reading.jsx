import React, { useEffect, useState } from 'react';

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

export function Books() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reading', {
          method: 'GET',
          credentials: 'include', // To send authentication cookies
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <main className="container-fluid body text-center">
      <p>
        <BookOfTheDay />
      </p>

      <h3>My Book Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
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
            <p>{review.content}</p>
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
    </main>
  );
}