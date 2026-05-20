-- =============================================
-- Candy Store Database Schema + Seed Data
-- =============================================

-- Tạo Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CandyStoreDB')
  CREATE DATABASE CandyStoreDB;
GO

USE CandyStoreDB;
GO

-- ── USERS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  email NVARCHAR(150) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20) NULL,
  address NVARCHAR(500) NULL,
  avatar NVARCHAR(500) NULL,
  role NVARCHAR(20) DEFAULT 'user',
  reset_token NVARCHAR(100) NULL,
  reset_expiry DATETIME NULL,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO

-- ── CATEGORIES ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
CREATE TABLE Categories (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  slug NVARCHAR(100) NOT NULL UNIQUE,
  emoji NVARCHAR(10) NULL,
  description NVARCHAR(500) NULL,
  image NVARCHAR(500) NULL,
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- ── BRANDS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Brands' AND xtype='U')
CREATE TABLE Brands (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  slug NVARCHAR(100) NOT NULL UNIQUE,
  logo NVARCHAR(500) NULL,
  country NVARCHAR(50) NULL,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- ── PRODUCTS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
CREATE TABLE Products (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(200) NOT NULL,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  description NVARCHAR(MAX) NULL,
  short_desc NVARCHAR(500) NULL,
  price DECIMAL(12,0) NOT NULL,
  sale_price DECIMAL(12,0) NULL,
  stock INT DEFAULT 0,
  sku NVARCHAR(50) NULL,
  weight DECIMAL(8,2) NULL,
  category_id INT NULL REFERENCES Categories(id),
  brand_id INT NULL REFERENCES Brands(id),
  images NVARCHAR(MAX) NULL,
  tags NVARCHAR(500) NULL,
  is_featured BIT DEFAULT 0,
  is_new BIT DEFAULT 0,
  is_active BIT DEFAULT 1,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  sold_count INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO

-- ── REVIEWS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U')
CREATE TABLE Reviews (
  id INT IDENTITY(1,1) PRIMARY KEY,
  product_id INT NOT NULL REFERENCES Products(id),
  user_id INT NOT NULL REFERENCES Users(id),
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment NVARCHAR(1000) NULL,
  is_approved BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- ── ORDERS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
CREATE TABLE Orders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NULL REFERENCES Users(id),
  order_number NVARCHAR(50) NOT NULL UNIQUE,
  subtotal DECIMAL(12,0) DEFAULT 0,
  shipping_fee DECIMAL(12,0) DEFAULT 0,
  total DECIMAL(12,0) DEFAULT 0,
  status NVARCHAR(20) DEFAULT 'pending',
  recipient_name NVARCHAR(100) NOT NULL,
  recipient_phone NVARCHAR(20) NOT NULL,
  shipping_address NVARCHAR(500) NOT NULL,
  city NVARCHAR(100) NULL,
  payment_method NVARCHAR(20) DEFAULT 'cod',
  note NVARCHAR(500) NULL,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO

-- ── ORDER ITEMS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' AND xtype='U')
CREATE TABLE OrderItems (
  id INT IDENTITY(1,1) PRIMARY KEY,
  order_id INT NOT NULL REFERENCES Orders(id),
  product_id INT NOT NULL,
  product_name NVARCHAR(200) NOT NULL,
  product_img NVARCHAR(500) NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,0) NOT NULL,
  total_price DECIMAL(12,0) NOT NULL
);
GO

-- ── CART ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart' AND xtype='U')
CREATE TABLE Cart (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL REFERENCES Users(id),
  product_id INT NOT NULL REFERENCES Products(id),
  quantity INT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE(),
  UNIQUE(user_id, product_id)
);
GO

-- ── BANNERS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Banners' AND xtype='U')
CREATE TABLE Banners (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(200) NULL,
  image NVARCHAR(500) NULL,
  link NVARCHAR(500) NULL,
  is_active BIT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- SEED DATA
-- =============================================

-- ── Users (password: 123456) ──
-- bcrypt hash of '123456'
INSERT INTO Users (name, email, password, phone, role) VALUES
(N'Admin Candy', 'admin@candy.vn', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9.oBQ8Nnlw8Ow3pYx5Wd1vKYi2', '0901234567', 'admin'),
(N'Nguyễn Văn A', 'user@candy.vn', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9.oBQ8Nnlw8Ow3pYx5Wd1vKYi2', '0912345678', 'user'),
(N'Trần Thị B', 'user2@candy.vn', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9.oBQ8Nnlw8Ow3pYx5Wd1vKYi2', '0923456789', 'user');
GO

-- ── Categories ──
INSERT INTO Categories (name, slug, emoji) VALUES
(N'Kẹo Ngọt',   'candy',     N'🍬'),
(N'Socola',      'chocolate', N'🍫'),
(N'Snack',       'snack',     N'🍿'),
(N'Bánh Quy',   'cookie',    N'🍪'),
(N'Kẹo Gum',    'gum',       N'🫧'),
(N'Combo Quà',  'gift',      N'🎁'),
(N'Nước Ngọt',  'drink',     N'🥤');
GO

-- ── Brands ──
INSERT INTO Brands (name, slug, country) VALUES
(N'Haribo',      'haribo',      N'Đức'),
(N'Lindt',       'lindt',       N'Thụy Sĩ'),
(N'Skittles',    'skittles',    N'Mỹ'),
(N'Oreo',        'oreo',        N'Mỹ'),
(N'Pop Rocks',   'pop-rocks',   N'Mỹ'),
(N'Pringles',    'pringles',    N'Mỹ'),
(N'Trolli',      'trolli',      N'Đức'),
(N'Kit Kat',     'kit-kat',     N'Nhật Bản'),
(N'Nerds',       'nerds',       N'Mỹ'),
(N'Sour Patch',  'sour-patch',  N'Mỹ'),
(N'Lay''s',      'lays',        N'Mỹ'),
(N'Candy Store', 'candy-store', N'Việt Nam');
GO

-- ── Products ──
INSERT INTO Products (name, slug, price, sale_price, stock, category_id, brand_id, images, is_featured, is_new, avg_rating, review_count, sold_count, short_desc) VALUES
(N'Kẹo Gummy Bears Haribo 250g',   'keo-gummy-bears-haribo-250g',   60000, 45000, 50, 1, 1,  '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 1, 0, 4.8, 128, 320, N'Kẹo dẻo gummy bears Haribo nổi tiếng thế giới'),
(N'Socola Đen Lindt 70% 100g',     'socola-den-lindt-70-100g',      85000, NULL,  30, 2, 2,  '["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400"]', 0, 1, 5.0, 96,  180, N'Socola đen Lindt 70% cacao nhập khẩu Thụy Sĩ'),
(N'Kẹo Skittles Trái Cây 191g',    'keo-skittles-trai-cay-191g',    42000, 35000, 80, 1, 3,  '["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400"]', 1, 0, 4.5, 214, 560, N'Kẹo Skittles đầy màu sắc với 5 hương vị trái cây'),
(N'Bánh Quy Oreo Dâu 120g',        'banh-quy-oreo-dau-120g',        28000, NULL,  100,4, 4,  '["https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400"]', 1, 0, 4.9, 301, 890, N'Bánh quy Oreo hương dâu tây thơm ngon'),
(N'Kẹo Pop Rocks Soda 9.5g',       'keo-pop-rocks-soda-9-5g',       22000, 18000, 60, 1, 5,  '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400"]', 0, 1, 4.3, 87,  150, N'Kẹo nổ Pop Rocks vị soda độc đáo'),
(N'Snack Pringles Original 165g',   'snack-pringles-original-165g',  75000, 65000, 45, 3, 6,  '["https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400"]', 1, 0, 4.9, 445, 1200,N'Snack Pringles vị Original giòn tan'),
(N'Kẹo Dẻo Trolli Sâu 100g',      'keo-deo-trolli-sau-100g',       39000, NULL,  40, 1, 7,  '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 0, 1, 4.4, 62,  95,  N'Kẹo dẻo hình con sâu Trolli chua ngọt'),
(N'Combo Quà Valentine 5 Món',      'combo-qua-valentine-5-mon',     220000,180000,20, 6, 12, '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400"]', 0, 0, 5.0, 33,  45,  N'Hộp quà Valentine gồm 5 món kẹo cao cấp'),
(N'Kẹo Nerds Rope Rainbow',         'keo-nerds-rope-rainbow',        38000, 22000, 55, 1, 9,  '["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400"]', 1, 0, 4.7, 88,  210, N'Kẹo dây Nerds Rope phủ đầy Nerds nhiều màu'),
(N'Socola Kit Kat 4 Finger',        'socola-kit-kat-4-finger',       45000, 32000, 70, 2, 8,  '["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400"]', 0, 0, 4.6, 120, 350, N'Bánh wafer Kit Kat phủ socola sữa giòn tan'),
(N'Kẹo Sour Patch Kids 99g',        'keo-sour-patch-kids-99g',       42000, 28000, 35, 1, 10, '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400"]', 0, 1, 4.8, 67,  130, N'Kẹo chua ngọt Sour Patch Kids'),
(N'Snack Lay''s Vị BBQ 155g',       'snack-lays-vi-bbq-155g',        62000, 45000, 90, 3, 11, '["https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400"]', 1, 0, 4.5, 234, 780, N'Snack khoai tây Lay''s vị BBQ đậm đà');
GO

-- ── Sample Orders ──
INSERT INTO Orders (user_id, order_number, subtotal, shipping_fee, total, status, recipient_name, recipient_phone, shipping_address, city, payment_method) VALUES
(2, 'ORD-20260515-12345', 150000, 30000, 180000, 'completed', N'Nguyễn Văn A', '0912345678', N'123 Nguyễn Huệ, Q.1', N'TP.HCM', 'cod'),
(2, 'ORD-20260518-67890', 350000, 0,     350000, 'pending',   N'Nguyễn Văn A', '0912345678', N'123 Nguyễn Huệ, Q.1', N'TP.HCM', 'banking'),
(3, 'ORD-20260519-11111', 85000,  30000, 115000, 'pending',   N'Trần Thị B',   '0923456789', N'456 Lê Lợi, Q.3',     N'TP.HCM', 'cod');
GO

INSERT INTO OrderItems (order_id, product_id, product_name, product_img, quantity, unit_price, total_price) VALUES
(1, 1, N'Kẹo Gummy Bears Haribo 250g', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', 2, 45000, 90000),
(1, 3, N'Kẹo Skittles Trái Cây 191g',  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', 2, 35000, 70000),
(2, 6, N'Snack Pringles Original 165g', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400', 3, 65000, 195000),
(2, 8, N'Combo Quà Valentine 5 Món',    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',    1, 180000,180000),
(3, 2, N'Socola Đen Lindt 70% 100g',   'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400',    1, 85000, 85000);
GO

-- ── Sample Reviews ──
INSERT INTO Reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, N'Kẹo ngon lắm, con tôi rất thích!'),
(1, 3, 5, N'Haribo chính hãng, giao hàng nhanh'),
(3, 2, 4, N'Skittles vị trái cây rất thơm, sẽ mua lại'),
(4, 3, 5, N'Oreo dâu ngon hơn vị gốc, recommend!'),
(6, 2, 5, N'Pringles giòn tan, ống thiết kế tiện lợi');
GO

PRINT '✅ Database CandyStoreDB đã được tạo và seed data thành công!';
GO
