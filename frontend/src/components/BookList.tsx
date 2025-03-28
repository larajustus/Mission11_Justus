import { useEffect, useState } from 'react';
import { book } from '../types/book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  //Ran when the user clicks "Add to Cart" button
  const handleAddToCart = (b: book) => {
    const newItem: CartItem = {
      bookID: b.bookID,
      title: b.title || 'No Title',
      author: b.author || 'Unknown Author',
      price: b.price || 0,
      quantity: 1,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  //Send info to backend api
  useEffect(() => {
    const fetchBook = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/Book?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };
    fetchBook();
  }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]);

  return (
    <>
      <label>
        Select Sort Order:
        <select
          value={sortOrder ?? ''} // This will pass '' if sortOrder is null
          onChange={(e) => setSortOrder(e.target.value || null)} // Set to null if no value is selected
        >
          <option value="">Default</option> {/* No sorting initially */}
          <option value="asc">Title A-Z</option>
          <option value="desc">Title Z-A</option>
        </select>
      </label>
      <br />
      {books.map(
        (
          b //map through the books in the database and display info on cards
        ) => (
          <div id="bookCard" className="card" key={b.bookID}>
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author:</strong> {b.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li>
                  <strong>Classification/Category:</strong> {b.classification}{' '}
                  {b.category}
                </li>
                <li>
                  <strong>Number of Pages:</strong> {b.pageCount}
                </li>
                <li>
                  <strong>Price:</strong> ${b.price}
                </li>
              </ul>

              <button
                className="btn btn-success"
                onClick={() => handleAddToCart(b)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        )
      )}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        {' '}
        {/*Subtract 1 so the display goes back a page */}
        Previous
      </button>

      {/*Creates however many page buttons are needed based on the number of books and the number of entries per page and implements their functionality */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setPageNum(i + 1)}
          disabled={pageNum === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        {' '}
        {/*Add 1 so the display goes forward a page */}
        Next
      </button>

      <br />
      {/*Drop down for the user to select how many books to display on a page*/}
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
