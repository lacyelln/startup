import React from 'react';

export function Person() {
  return (
    <main className="container-fluid body text-center">
      <h3>My Page</h3>
      <label htmlFor="myDropdown">Select which option you'd like to do:</label>
      <select id="myDropdown" name="postOption">
        <option value="writings">Post my writing</option>
        <option value="books">Post a book review</option>
      </select>
      <p><i>Placeholder: This will alternate when the buttons actually do something.</i></p>

      <hr />

      <h3>Post your writing:</h3>
      <textarea rows="1" cols="50" placeholder="Title"></textarea>
      <textarea
        rows="5"
        cols="50"
        placeholder="Post your writing here..."
        style={{ width: "100%", height: "200px", overflowY: "auto" }}
      ></textarea>
      <button type="submit">Upload</button>

      <hr />

      <h3>Post a book review:</h3>
      <textarea rows="1" cols="50" placeholder="Title of book"></textarea>
      <textarea
        rows="5"
        cols="50"
        placeholder="Write your thoughts here..."
        style={{ width: "100%", height: "200px", overflowY: "auto" }}
      ></textarea>
      
      <label htmlFor="rating-review">Overall Rating:</label>
      <input type="range" id="rating-review" name="rating" min="0" max="10" defaultValue="5" /><br />

      <label htmlFor="fileUpload">Feel free to add a picture with your post:</label>
      <input type="file" id="fileUpload" name="fileUpload" accept="image/*" />
      <br />

      <button type="submit">Submit rating</button>

      <hr />
    </main>
  );
}
