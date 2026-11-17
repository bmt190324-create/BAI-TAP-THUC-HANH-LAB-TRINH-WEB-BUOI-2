using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PracticeLab2.Api.Data;
using PracticeLab2.Api.DTOs;
using PracticeLab2.Api.Models;

namespace PracticeLab2.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/products
        // Lấy toàn bộ danh sách sản phẩm
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products
                .AsNoTracking()
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }

        // 2. GET: api/products/{id}
        // Lấy chi tiết 1 sản phẩm theo ID
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id}" });
            }

            return Ok(product);
        }

        // 3. POST: api/products
        // Tạo mới sản phẩm
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "Gear / Laptop" : dto.Category,
                Price = dto.Price,
                Stock = dto.Stock,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // 4. PUT: api/products/{id}
        // Cập nhật toàn bộ thông tin sản phẩm theo ID
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            if (dto.Id.HasValue && dto.Id.Value != 0 && dto.Id.Value != id)
            {
                return BadRequest(new { message = "ID trong đường dẫn URL không khớp với ID trong JSON Body." });
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id} để cập nhật." });
            }

            existingProduct.Name = dto.Name;
            existingProduct.Category = string.IsNullOrWhiteSpace(dto.Category) ? existingProduct.Category : dto.Category;
            existingProduct.Price = dto.Price;
            existingProduct.Stock = dto.Stock;

            await _context.SaveChangesAsync();

            return Ok(existingProduct);
        }

        // 5. DELETE: api/products/{id}
        // Xóa sản phẩm theo ID
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id} để xóa." });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa thành công sản phẩm ID = {id}", deletedId = id });
        }
    }
}
