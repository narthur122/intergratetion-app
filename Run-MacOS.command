#!/bin/bash
cd "$(dirname "$0")"
clear
echo "🚀 Aesthetica Studio Hub - macOS"

# Dọn dẹp cổng 3000
lsof -ti:3000 | xargs kill -9 > /dev/null 2>&1

# Chạy server từ thư mục src
node src/server.js &

sleep 1
open "http://localhost:3000"
echo "✅ DONE!"