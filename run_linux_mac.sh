#!/usr/bin/env bash
echo "====================================================================="
echo "  BAI TAP THUC HANH SO 2 - ASP.NET CORE API + EF CORE + AXIOS"
echo "====================================================================="
cd "$(dirname "$0")/Backend_AspNetCore" || exit 1
echo "[*] Dang khoi dong ASP.NET Core API tai http://localhost:5000 ..."
dotnet run --urls "http://localhost:5000"
