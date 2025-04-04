using Microsoft.AspNetCore.Mvc;
using Mission11_Justus.Data;

namespace Mission11_Justus.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookDbContext;

        public BookController(BookDbContext temp) => _bookDbContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = null, [FromQuery] List<string>? bookCategories = null)
        {
            var books = _bookDbContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                books = books.Where(b => bookCategories.Contains(b.Category));
            }

            if (!string.IsNullOrEmpty(sortOrder)) 
            {
                if (sortOrder.ToLower() == "asc")
                {
                    books = books.OrderBy(b => b.Title);
                }
                else if (sortOrder.ToLower() == "desc")
                {
                    books = books.OrderByDescending(b => b.Title);
                }
            }
            
            var totalNumBooks = books.Count();

            var bookList = books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var someObjects = new
            {
                Books = bookList,
                TotalNumBooks = totalNumBooks
            };
            
            return Ok(someObjects);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookDbContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookDbContext.Books.Add(newBook);
            _bookDbContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookDbContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookDbContext.Books.Update(existingBook);
            _bookDbContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]

        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookDbContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookDbContext.Books.Remove(book);
            _bookDbContext.SaveChanges();

            return NoContent();
        }
    }
}
