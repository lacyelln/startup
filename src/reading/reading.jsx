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
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(storedReviews);
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
        <p>Little Red Riding Hood:</p>
        <img
          src="https://kidsbookspublishing.com/wp-content/uploads/2022/02/Fairy-Tale-Series_Little-Red-Riding-Hood-FC-1-1.jpg"
          width="200"
          height="300"
          alt="Little Red Riding Hood book cover"
          style={{ borderRadius: '5px' }}
        />
        <p>
          Little Red Riding Hood was such a good book to read to my little kids. They loved it and want to hear it all
          the time now. Totally 10/10.
        </p>
        <label htmlFor="rating-little-red">Overall Rating:</label>
        <input
          type="range"
          id="rating-little-red"
          name="rating-little-red"
          min="0"
          max="10"
          value="10"
          readOnly
          style={{ width: '100%' }}
        />
        <p>
          <i>Placeholder: In future this will be accurate with what is stored in the database as the score.</i>
        </p>
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
        <p>Goldilocks and the Three Bears:</p>
        <img
          src="https://cdn.firstcry.com/education/2022/09/10141447/goldilocks-three-bears-fairy-tale-one-768x525.jpg"
          width="300"
          height="300"
          alt="Goldilocks and the Three Bears book cover"
          style={{ borderRadius: '5px' }}
        />
        <p>
          Goldilocks was a terrible read. Such a bad example for little kids—teaching them to take things without asking.
          Unless you want your kids to be spoiled, don't read it to them. Totally a 3/10.
        </p>
        <label htmlFor="rating-goldilocks">Overall Rating:</label>
        <input
          type="range"
          id="rating-goldilocks"
          name="rating-goldilocks"
          min="0"
          max="10"
          value="3"
          readOnly
          style={{ width: '100%' }}
        />
      </div>

      <p>
        <i>Placeholder: In future this will be populated with what others have submitted in the database.</i>
      </p>
    </main>
  );
}
