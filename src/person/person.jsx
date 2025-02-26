import React, { useState } from 'react';

import { PostWriting } from './postWritings';
import { PostReview } from './postReadings';


export function Person() {
  const [selectedOption, setSelectedOption] = useState('writings');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <main className="container-fluid body text-center">
      <h3>My Page</h3>
      <label htmlFor="myDropdown">Select which option you'd like to do:</label>
      <select id="myDropdown" name="postOption" value={selectedOption} onChange={handleChange}>
        <option value="writings">Post my writing</option>
        <option value="books">Post a book review</option>
      </select>
      
      <hr />

      {selectedOption === 'writings' && (
        <>
          <PostWriting />
        </>
      )}

      {selectedOption === 'books' && (
        <>
          <PostReview/>
        </>
      )}

      <hr />
    </main>
  );
}
