using Microsoft.EntityFrameworkCore;
using PracticeLab2.Api.Models;

namespace PracticeLab2.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Tự động áp dụng Migration để tạo bảng nếu chưa tồn tại
            context.Database.Migrate();

            // Nếu đã có dữ liệu thì không seed thêm
            if (context.Products.Any())
            {
                return;
            }

            var sampleProducts = new List<Product>
            {
                new Product
                {
                    Name = "ASUS TUF Gaming F15 (i5-11400H / RTX 2050)",
                    Category = "Laptop Gaming",
                    Price = 18990000m,
                    Stock = 8,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "RAM Kingston Fury Impact 16GB DDR4 3200MHz",
                    Category = "Linh kiện nâng cấp",
                    Price = 890000m,
                    Stock = 25,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Ổ cứng SSD Samsung 980 PRO 1TB NVMe M.2",
                    Category = "Lưu trữ",
                    Price = 2450000m,
                    Stock = 15,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Bàn phím cơ AKKO 3087 RF Dragon Ball Z",
                    Category = "Gaming Gear",
                    Price = 1590000m,
                    Stock = 12,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Products.AddRange(sampleProducts);
            context.SaveChanges();
        }
    }
}
