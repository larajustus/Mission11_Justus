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
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = null)
        {
            var books = _bookDbContext.Books.AsQueryable();

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

            var bookList = books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _bookDbContext.Books.Count();

            var someObjects = new
            {
                Books = bookList,
                TotalNumBooks = totalNumBooks
            };
            
            return Ok(someObjects);
        }
    }
}
