using Microsoft.EntityFrameworkCore;
using PracticeLab2.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Controllers
builder.Services.AddControllers();

// 2. Cấu hình kết nối Database với EF Core (Hỗ trợ cả SQLite chạy ngay và SQL Server)
var dbProvider = builder.Configuration.GetValue<string>("DatabaseProvider") ?? "Sqlite";
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnection"));
    }
    else
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"));
    }
});

// 3. Cấu hình CORS cho phép Front-end (Axios) gọi API từ mọi port (Live Server, React, Vite, file://)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Đăng ký Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Practice Lab 2 - ASP.NET Core & EF Core API", Version = "v1" });
});

var app = builder.Build();

// 5. Tự động chạy EF Core Migration và Seed dữ liệu mẫu ngay khi khởi động
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi xảy ra khi khởi tạo hoặc migrate Database.");
    }
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Practice Lab 2 API v1");
    c.RoutePrefix = "swagger"; // Truy cập Swagger tại http://localhost:5000/swagger
});

app.UseCors("AllowAllOrigins");

// Phục vụ trực tiếp giao diện Front-end Axios tại http://localhost:5000
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

app.Run();
