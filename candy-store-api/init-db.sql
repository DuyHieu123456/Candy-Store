-- =============================================
-- Candy Store Database Schema + Seed Data
-- =============================================

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
  parent_id INT NULL,
  sort_order INT DEFAULT 0,
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
  description NVARCHAR(500) NULL,
  website NVARCHAR(500) NULL,
  country NVARCHAR(50) NULL,
  is_active BIT DEFAULT 1,
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
  country NVARCHAR(10) NULL,
  dietary NVARCHAR(200) NULL,
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

-- ── CARTS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Carts' AND xtype='U')
CREATE TABLE Carts (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NULL REFERENCES Users(id),
  session_id NVARCHAR(100) NULL,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- ── CART ITEMS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CartItems' AND xtype='U')
CREATE TABLE CartItems (
  id INT IDENTITY(1,1) PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES Carts(id),
  product_id INT NOT NULL REFERENCES Products(id),
  quantity INT DEFAULT 1,
  added_at DATETIME DEFAULT GETDATE()
);
GO

-- ── BANNERS ──
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Banners' AND xtype='U')
CREATE TABLE Banners (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(200) NULL,
  subtitle NVARCHAR(500) NULL,
  image NVARCHAR(500) NULL,
  link NVARCHAR(500) NULL,
  btn_text NVARCHAR(100) NULL,
  position NVARCHAR(50) DEFAULT 'hero',
  is_active BIT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- SEED DATA
-- =============================================

-- ── Users (password: 123456) ──
INSERT INTO Users (name, email, password, phone, role) VALUES
(N'Admin Candy', 'admin@candy.vn', '$2b$10$LAV308i4XoO9BoSL12DGmebyw015SVXkZOzxp7Q/SnimkVipsvEL6', '0901234567', 'admin'),
(N'Nguyen Van A', 'user@candy.vn', '$2b$10$LAV308i4XoO9BoSL12DGmebyw015SVXkZOzxp7Q/SnimkVipsvEL6', '0912345678', 'user'),
(N'Tran Thi B', 'user2@candy.vn', '$2b$10$LAV308i4XoO9BoSL12DGmebyw015SVXkZOzxp7Q/SnimkVipsvEL6', '0923456789', 'user');
GO

-- ── Categories ──
INSERT INTO Categories (name, slug, emoji, sort_order) VALUES
(N'Keo Ngot',   'candy',     N'🍬', 1),
(N'Socola',     'chocolate', N'🍫', 2),
(N'Snack',      'snack',     N'🍿', 3),
(N'Banh Quy',   'cookie',    N'🍪', 4),
(N'Keo Gum',    'gum',       N'🫧', 5),
(N'Combo Qua',  'gift',      N'🎁', 6),
(N'Nuoc Ngot',  'drink',     N'🥤', 7);
GO

-- ── Brands ──
INSERT INTO Brands (name, slug, country, is_active) VALUES
(N'Haribo',      'haribo',      N'Duc',       1),
(N'Lindt',       'lindt',       N'Thuy Si',   1),
(N'Skittles',    'skittles',    N'My',        1),
(N'Oreo',        'oreo',        N'My',        1),
(N'Pop Rocks',   'pop-rocks',   N'My',        1),
(N'Pringles',    'pringles',    N'My',        1),
(N'Trolli',      'trolli',      N'Duc',       1),
(N'Kit Kat',     'kit-kat',     N'Nhat Ban',  1),
(N'Nerds',       'nerds',       N'My',        1),
(N'Sour Patch',  'sour-patch',  N'My',        1),
(N'Lay''s',      'lays',        N'My',        1),
(N'Candy Store', 'candy-store', N'Viet Nam',  1);
GO

-- ── Products ──
INSERT INTO Products (name, slug, price, sale_price, stock, category_id, brand_id, images, is_featured, is_new, avg_rating, review_count, sold_count, short_desc, country, dietary) VALUES
(N'Keo Gummy Bears Haribo 250g',   'keo-gummy-bears-haribo-250g',   60000, 45000, 50, 1, 1,  '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 1, 0, 4.8, 128, 320, N'Keo deo gummy bears Haribo noi tieng the gioi',       'de', '["halal"]'),
(N'Socola Den Lindt 70% 100g',     'socola-den-lindt-70-100g',      85000, NULL,  30, 2, 2,  '["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400"]', 0, 1, 5.0, 96,  180, N'Socola den Lindt 70% cacao nhap khau Thuy Si',        'ch', '["gluten-free","vegan"]'),
(N'Keo Skittles Trai Cay 191g',    'keo-skittles-trai-cay-191g',    42000, 35000, 80, 1, 3,  '["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400"]', 1, 0, 4.5, 214, 560, N'Keo Skittles day mau sac voi 5 huong vi trai cay',    'us', '["gluten-free","vegan"]'),
(N'Banh Quy Oreo Dau 120g',        'banh-quy-oreo-dau-120g',        28000, NULL,  100,4, 4,  '["https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400"]', 1, 0, 4.9, 301, 890, N'Banh quy Oreo huong dau tay thom ngon',                'us', '[]'),
(N'Keo Pop Rocks Soda 9.5g',       'keo-pop-rocks-soda-9-5g',       22000, 18000, 60, 1, 5,  '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400"]', 0, 1, 4.3, 87,  150, N'Keo no Pop Rocks vi soda doc dao',                     'us', '["gluten-free"]'),
(N'Snack Pringles Original 165g',   'snack-pringles-original-165g',  75000, 65000, 45, 3, 6,  '["https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400"]', 1, 0, 4.9, 445, 1200,N'Snack Pringles vi Original gion tan',                  'us', '["gluten-free"]'),
(N'Keo Deo Trolli Sau 100g',       'keo-deo-trolli-sau-100g',       39000, NULL,  40, 1, 7,  '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 0, 1, 4.4, 62,  95,  N'Keo deo hinh con sau Trolli chua ngot',                'de', '[]'),
(N'Combo Qua Valentine 5 Mon',     'combo-qua-valentine-5-mon',     220000,180000,20, 6, 12, '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400"]', 0, 0, 5.0, 33,  45,  N'Hop qua Valentine gom 5 mon keo cao cap',             'vn', '[]'),
(N'Keo Nerds Rope Rainbow',        'keo-nerds-rope-rainbow',        38000, 22000, 55, 1, 9,  '["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400"]', 1, 0, 4.7, 88,  210, N'Keo day Nerds Rope phu day Nerds nhieu mau',          'us', '["gluten-free"]'),
(N'Socola Kit Kat 4 Finger',       'socola-kit-kat-4-finger',       45000, 32000, 70, 2, 8,  '["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400"]', 0, 0, 4.6, 120, 350, N'Banh wafer Kit Kat phu socola sua gion tan',           'jp', '[]'),
(N'Keo Sour Patch Kids 99g',       'keo-sour-patch-kids-99g',       42000, 28000, 35, 1, 10, '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400"]', 0, 1, 4.8, 67,  130, N'Keo chua ngot Sour Patch Kids',                        'us', '["gluten-free","vegan"]'),
(N'Snack Lay''s Vi BBQ 155g',      'snack-lays-vi-bbq-155g',        62000, 45000, 90, 3, 11, '["https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400"]', 1, 0, 4.5, 234, 780, N'Snack khoai tay Lay''s vi BBQ dam da',                 'us', '["gluten-free"]');
GO

-- ── Banners ──
INSERT INTO Banners (title, subtitle, image, link, btn_text, position, sort_order) VALUES
(N'NGOT NGAO VO TAN', N'Kham pha hang tram loai keo nhap khau tu khap noi tren the gioi', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1200', '/products', N'Mua Ngay', 'hero', 1),
(N'FLASH SALE - GIAM 50%', N'Chuong trinh khuyen mai dac biet - so luong co han!', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200', '/products?sale=true', N'San Sale', 'hero', 2),
(N'COMBO QUA DAC BIET', N'Tang qua ngot ngao cho nguoi than - Sinh nhat, Le Tet, Valentine', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1200', '/products?category=gift', N'Chon Qua', 'hero', 3);
GO

-- ── Sample Orders ──
INSERT INTO Orders (user_id, order_number, subtotal, shipping_fee, total, status, recipient_name, recipient_phone, shipping_address, city, payment_method) VALUES
(2, 'ORD-20260515-12345', 150000, 30000, 180000, 'completed', N'Nguyen Van A', '0912345678', N'123 Nguyen Hue, Q.1', N'TP.HCM', 'cod'),
(2, 'ORD-20260518-67890', 350000, 0,     350000, 'pending',   N'Nguyen Van A', '0912345678', N'123 Nguyen Hue, Q.1', N'TP.HCM', 'banking'),
(3, 'ORD-20260519-11111', 85000,  30000, 115000, 'pending',   N'Tran Thi B',   '0923456789', N'456 Le Loi, Q.3',     N'TP.HCM', 'cod');
GO

INSERT INTO OrderItems (order_id, product_id, product_name, product_img, quantity, unit_price, total_price) VALUES
(1, 1, N'Keo Gummy Bears Haribo 250g', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', 2, 45000, 90000),
(1, 3, N'Keo Skittles Trai Cay 191g',  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', 2, 35000, 70000),
(2, 6, N'Snack Pringles Original 165g', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400', 3, 65000, 195000),
(2, 8, N'Combo Qua Valentine 5 Mon',    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',    1, 180000,180000),
(3, 2, N'Socola Den Lindt 70% 100g',   'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400',    1, 85000, 85000);
GO

-- ── Sample Reviews ──
INSERT INTO Reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, N'Keo ngon lam, con toi rat thich!'),
(1, 3, 5, N'Haribo chinh hang, giao hang nhanh'),
(3, 2, 4, N'Skittles vi trai cay rat thom, se mua lai'),
(4, 3, 5, N'Oreo dau ngon hon vi goc, recommend!'),
(6, 2, 5, N'Pringles gion tan, ong thiet ke tien loi');
GO

PRINT 'Database CandyStoreDB created and seeded successfully!';
GO
