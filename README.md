# Bài Tập Thực Hành Số 2: ASP.NET Core Web API + EF Core + Axios

Dự án này đã được hoàn thiện đầy đủ **100% cả 5 yêu cầu** trong đề bài và được cấu hình ở chế độ **Zero-Config (Tải về là chạy ngay)**.

---

## 1. Cấu trúc thư mục

```text
BaiTapThucHanhSo2/
├── run_windows.bat               # Click đúp để chạy ngay trên Windows
├── run_linux_mac.sh              # Script chạy nhanh trên Linux / macOS
├── PracticeLab2.sln              # File Solution mở bằng Visual Studio 2022
├── Backend_AspNetCore/           # Project ASP.NET Core Web API (.NET 8.0)
│   ├── Controllers/
│   │   └── ProductsController.cs # Đầy đủ các endpoint GET, POST, PUT, DELETE
│   ├── Data/
│   │   ├── AppDbContext.cs       # Cấu hình EF Core DbContext
│   │   └── DbInitializer.cs      # Tự động chạy Migration & Seed dữ liệu mẫu
│   ├── DTOs/
│   │   └── ProductDto.cs         # Data Transfer Objects cho POST và PUT
│   ├── Migrations/               # Bộ file Migration EF Core đã khởi tạo sẵn
│   ├── Models/
│   │   └── Product.cs            # Entity Model ánh xạ vào bảng Products
│   ├── wwwroot/                  # Tích hợp sẵn giao diện Axios để chạy cùng port 5000
│   ├── appsettings.json          # Cấu hình ConnectionString (SQLite & SQL Server)
│   └── Program.cs                # Cấu hình DI, EF Core, CORS, Swagger
└── Frontend_Axios/               # Thư mục Front-end tách rời (HTML + Bootstrap 5 + Axios)
    ├── index.html
    ├── app.js                    # Code Axios gọi đủ GET, POST, PUT, DELETE + Logger
    └── styles.css
```

---

## 2. Hướng dẫn chạy ngay (Chỉ cần 1 bước)

### Cách 1: Chạy tự động trên Windows
1. Giải nén file `.zip`.
2. Nhấp đúp vào file **`run_windows.bat`**.
3. Trình duyệt sẽ tự động mở địa chỉ `http://localhost:5000` hiển thị bảng điều khiển **Axios Front-end** và kết nối trực tiếp tới Database.

### Cách 2: Chạy bằng dòng lệnh (Terminal / PowerShell)
```bash
cd Backend_AspNetCore
dotnet run --urls "http://localhost:5000"
```
* **Giao diện Front-end (Axios):** `http://localhost:5000` (hoặc mở trực tiếp file `Frontend_Axios/index.html` bằng Live Server).
* **Giao diện Swagger UI:** `http://localhost:5000/swagger`

---

## 3. Chuyển đổi giữa SQLite (Mặc định) và SQL Server

Để giúp bạn tải về chạy được ngay mà không cần cài đặt hay cấu hình SQL Server phức tạp, project đang để mặc định `"DatabaseProvider": "Sqlite"` trong `appsettings.json` (tự động tạo file `PracticeLab2.db` và nạp sẵn 4 sản phẩm mẫu).

Nếu giảng viên yêu cầu kết nối vào **Microsoft SQL Server**, bạn chỉ cần mở `Backend_AspNetCore/appsettings.json` và đổi:
```json
"DatabaseProvider": "SqlServer",
"ConnectionStrings": {
  "SqliteConnection": "Data Source=PracticeLab2.db",
  "SqlServerConnection": "Server=localhost;Database=PracticeLab2Db;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```
Khi chạy `dotnet run`, hàm `context.Database.Migrate()` trong `DbInitializer.cs` sẽ tự động tạo Database `PracticeLab2Db` và bảng `Products` trên SQL Server của bạn.

---

## 4. Các lệnh EF Core CLI (Dùng khi muốn tự tạo thêm Migration mới)

Nếu bạn chỉnh sửa class `Models/Product.cs` và muốn tạo bản Migration mới bằng tay:
```bash
cd Backend_AspNetCore
dotnet ef migrations add CapNhatBangProduct
dotnet ef database update
```
