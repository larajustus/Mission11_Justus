import { useState } from 'react';
import { book } from '../types/book';
import { updateBook } from '../api/BooksAPI';

interface EditBookFormProps {
  book: book;
  onSuccess: () => void;
  onCancel: () => void;
}

// When the user clicks the Edit button, this function is called
const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  // Map through the books until it pulls up the book that the user selected for the form
  const [formData, setFormData] = useState<book>({ ...book });

  // Match the data with the name of the form input box
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //When the user hits Update Book, the api call to update the book is called, passing it the bookID
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookID, formData);
    onSuccess();
  };

  // Return a form that autopopulates the data from the book they selected to then be updated if user wants
  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Book</h2>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
      </label>
      <label>
        Publisher:
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        />
      </label>
      <label>
        ISBN:
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
      </label>
      <label>
        Classification:
        <input
          type="text"
          name="classification"
          value={formData.classification}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Page Count:
        <input
          type="text"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update Book</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditBookForm;
