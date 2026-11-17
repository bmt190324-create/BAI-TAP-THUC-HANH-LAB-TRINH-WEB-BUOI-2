@echo off
chcp 65001 >nul
echo =====================================================================
echo   BAI TAP THUC HANH SO 2 - ASP.NET CORE API + EF CORE + AXIOS
echo =====================================================================
echo.
cd /d "%~dp0Backend_AspNetCore"
echo [1/2] Dang khoi dong ASP.NET Core Web API va tu dong Migrate Database...
echo [2/2] Sau khi Server chay, mo trinh duyet tai:
echo       - Giao dien Axios Front-end : http://localhost:5000
echo       - Tai lieu Swagger UI       : http://localhost:5000/swagger
echo.
start "" "http://localhost:5000"
dotnet run --urls "http://localhost:5000"
pause
