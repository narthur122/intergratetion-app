@echo off
title Aesthetica Studio Hub
taskkill /f /im node.exe >nul 2>&1

echo [1/2] Starting Backend Proxy Service...
:: Chạy file server.js nằm bên trong thư mục src
start /min node src/server.js

timeout /t 1 /nobreak > nul

echo [2/2] Launching Interface...
start http://localhost:3000

echo ✅ DONE! Tool is ready.