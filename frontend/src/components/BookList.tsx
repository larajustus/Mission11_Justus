import { useEffect, useState } from 'react';
import { book } from '../types/book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { fetchBook } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBook(
          pageSize,
          pageNum,
          sortOrder,
          selectedCategories
        );
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(totalItems / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
