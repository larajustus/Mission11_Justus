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

        [HttpGet]
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
    }
}
