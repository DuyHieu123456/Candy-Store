#!/bin/bash
# Candy Store - Khởi chạy Docker SQL Server + Seed Data

echo "🍬 Candy Store - Setup Database"
echo "================================"

# 1. Khởi động SQL Server container
echo "📦 Đang khởi động SQL Server..."
docker compose up -d

# 2. Chờ SQL Server sẵn sàng
echo "⏳ Đợi SQL Server khởi động (30s)..."
sleep 30

# 3. Chạy seed data
echo "🌱 Đang tạo database và seed data..."
docker exec -i candy-store-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "CandyStore@2024!" -C \
  -i /dev/stdin < init-db.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Setup hoàn tất!"
  echo ""
  echo "📋 Thông tin đăng nhập:"
  echo "   Admin: admin@candy.vn / 123456"
  echo "   User:  user@candy.vn  / 123456"
  echo ""
  echo "🚀 Chạy backend: npm run dev"
  echo "🌐 Chạy frontend: cd ../Candy-Store-main && npm run dev"
else
  echo "❌ Lỗi khi seed data. Thử lại sau vài giây:"
  echo "   docker exec -i candy-store-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'CandyStore@2024!' -C -i /dev/stdin < init-db.sql"
fi
