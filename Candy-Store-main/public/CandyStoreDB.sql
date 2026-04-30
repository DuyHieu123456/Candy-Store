-- ============================================================
-- CANDY STORE DATABASE SCHEMA + SEED DATA
-- Database: CandyStoreDB (SQL Server)
-- ============================================================
CREATE DATABASE CandyStoreDB;
GO

USE CandyStoreDB;
GO

-- ============================================================
-- DROP TABLES (nếu đã tồn tại, xóa theo thứ tự FK)
-- ============================================================
IF OBJECT_ID('OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('CartItems', 'U') IS NOT NULL DROP TABLE CartItems;
IF OBJECT_ID('Carts', 'U') IS NOT NULL DROP TABLE Carts;
IF OBJECT_ID('Reviews', 'U') IS NOT NULL DROP TABLE Reviews;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Categories', 'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Brands', 'U') IS NOT NULL DROP TABLE Brands;
IF OBJECT_ID('Banners', 'U') IS NOT NULL DROP TABLE Banners;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE Users (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    email       NVARCHAR(150)  NOT NULL UNIQUE,
    password    NVARCHAR(255)  NOT NULL,
    phone       NVARCHAR(20)   NULL,
    address     NVARCHAR(500)  NULL,
    role        NVARCHAR(20)   NOT NULL DEFAULT 'customer',  -- 'customer' | 'admin'
    avatar      NVARCHAR(500)  NULL,
    created_at  DATETIME       DEFAULT GETDATE(),
    updated_at  DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE Categories (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    slug        NVARCHAR(120)  NOT NULL UNIQUE,
    description NVARCHAR(500)  NULL,
    image       NVARCHAR(500)  NULL,
    parent_id   INT            NULL REFERENCES Categories(id),
    sort_order  INT            DEFAULT 0,
    is_active   BIT            DEFAULT 1,
    created_at  DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- 3. BRANDS
-- ============================================================
CREATE TABLE Brands (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    slug        NVARCHAR(120)  NOT NULL UNIQUE,
    logo        NVARCHAR(500)  NULL,
    description NVARCHAR(500)  NULL,
    website     NVARCHAR(300)  NULL,
    is_active   BIT            DEFAULT 1,
    created_at  DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
CREATE TABLE Products (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(200)   NOT NULL,
    slug            NVARCHAR(220)   NOT NULL UNIQUE,
    description     NVARCHAR(MAX)   NULL,
    short_desc      NVARCHAR(500)   NULL,
    price           DECIMAL(10,2)   NOT NULL,
    sale_price      DECIMAL(10,2)   NULL,
    stock           INT             NOT NULL DEFAULT 0,
    sku             NVARCHAR(50)    NULL UNIQUE,
    weight          DECIMAL(6,2)    NULL,         -- gram
    category_id     INT             NULL REFERENCES Categories(id),
    brand_id        INT             NULL REFERENCES Brands(id),
    images          NVARCHAR(MAX)   NULL,          -- JSON array of URLs
    tags            NVARCHAR(500)   NULL,           -- comma separated
    is_featured     BIT             DEFAULT 0,
    is_new          BIT             DEFAULT 0,
    is_active       BIT             DEFAULT 1,
    sold_count      INT             DEFAULT 0,
    avg_rating      DECIMAL(3,2)    DEFAULT 0,
    review_count    INT             DEFAULT 0,
    created_at      DATETIME        DEFAULT GETDATE(),
    updated_at      DATETIME        DEFAULT GETDATE()
);
GO

-- ============================================================
-- 5. REVIEWS
-- ============================================================
CREATE TABLE Reviews (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    product_id  INT            NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    user_id     INT            NOT NULL REFERENCES Users(id)    ON DELETE CASCADE,
    rating      TINYINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     NVARCHAR(1000) NULL,
    is_approved BIT            DEFAULT 1,
    created_at  DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- 6. CARTS
-- ============================================================
CREATE TABLE Carts (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    user_id     INT            NULL REFERENCES Users(id) ON DELETE CASCADE,
    session_id  NVARCHAR(100)  NULL,   -- cho guest
    created_at  DATETIME       DEFAULT GETDATE(),
    updated_at  DATETIME       DEFAULT GETDATE()
);
GO

CREATE TABLE CartItems (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    cart_id     INT            NOT NULL REFERENCES Carts(id)    ON DELETE CASCADE,
    product_id  INT            NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    quantity    INT            NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at    DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- 7. ORDERS
-- ============================================================
CREATE TABLE Orders (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    user_id          INT            NULL REFERENCES Users(id),
    order_number     NVARCHAR(20)   NOT NULL UNIQUE,
    status           NVARCHAR(30)   NOT NULL DEFAULT 'pending',
        -- pending | confirmed | processing | shipped | delivered | cancelled
    subtotal         DECIMAL(10,2)  NOT NULL,
    shipping_fee     DECIMAL(10,2)  NOT NULL DEFAULT 0,
    discount         DECIMAL(10,2)  NOT NULL DEFAULT 0,
    total            DECIMAL(10,2)  NOT NULL,
    -- Shipping address
    recipient_name   NVARCHAR(100)  NOT NULL,
    recipient_phone  NVARCHAR(20)   NOT NULL,
    shipping_address NVARCHAR(500)  NOT NULL,
    city             NVARCHAR(100)  NOT NULL,
    state            NVARCHAR(100)  NULL,
    zip_code         NVARCHAR(20)   NULL,
    country          NVARCHAR(50)   NOT NULL DEFAULT 'US',
    -- Payment
    payment_method   NVARCHAR(50)   NOT NULL DEFAULT 'cod',
    payment_status   NVARCHAR(30)   NOT NULL DEFAULT 'unpaid',
    note             NVARCHAR(500)  NULL,
    created_at       DATETIME       DEFAULT GETDATE(),
    updated_at       DATETIME       DEFAULT GETDATE()
);
GO

CREATE TABLE OrderItems (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    order_id    INT             NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    product_id  INT             NULL REFERENCES Products(id)  ON DELETE SET NULL,
    product_name NVARCHAR(200)  NOT NULL,
    product_img  NVARCHAR(500)  NULL,
    quantity    INT             NOT NULL,
    unit_price  DECIMAL(10,2)  NOT NULL,
    total_price DECIMAL(10,2)  NOT NULL
);
GO

-- ============================================================
-- 8. BANNERS
-- ============================================================
CREATE TABLE Banners (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    title       NVARCHAR(200)  NULL,
    subtitle    NVARCHAR(300)  NULL,
    image       NVARCHAR(500)  NOT NULL,
    link        NVARCHAR(300)  NULL,
    btn_text    NVARCHAR(50)   NULL,
    position    NVARCHAR(30)   NOT NULL DEFAULT 'hero',  -- hero | promo | sidebar
    sort_order  INT            DEFAULT 0,
    is_active   BIT            DEFAULT 1,
    created_at  DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IX_Products_Category    ON Products(category_id);
CREATE INDEX IX_Products_Brand       ON Products(brand_id);
CREATE INDEX IX_Products_Featured    ON Products(is_featured);
CREATE INDEX IX_Products_Active      ON Products(is_active);
CREATE INDEX IX_Reviews_Product      ON Reviews(product_id);
CREATE INDEX IX_Orders_User          ON Orders(user_id);
CREATE INDEX IX_CartItems_Cart       ON CartItems(cart_id);
GO

-- ============================================================
-- ============================================================
-- SEED DATA
-- ============================================================
-- ============================================================

-- ============================================================
-- USERS (1 admin + 3 customers)
-- password hash cho 'password123' dùng bcrypt
-- ============================================================
INSERT INTO Users (name, email, password, phone, role) VALUES
('Admin Store',    'admin@candystore.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0001', 'admin'),
('Alice Johnson',  'alice@example.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0101', 'customer'),
('Bob Smith',      'bob@example.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0102', 'customer'),
('Carol Williams', 'carol@example.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0103', 'customer');
GO

-- ============================================================
-- CATEGORIES (parent + children)
-- ============================================================
INSERT INTO Categories (name, slug, description, image, parent_id, sort_order) VALUES
-- Parent categories
('Chocolate',       'chocolate',       'Rich chocolate treats from around the world',     'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', NULL, 1),
('Gummy & Chewy',   'gummy-chewy',     'Bears, worms, sour belts and more chewy delights','https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', NULL, 2),
('Hard Candy',      'hard-candy',      'Classic hard candies and lollipops',               'https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=400', NULL, 3),
('Sour Candy',      'sour-candy',      'Pucker up! The sourest candies ever made',         'https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=400', NULL, 4),
('Novelty Candy',   'novelty-candy',   'Fun, unique and pop-culture inspired treats',      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400', NULL, 5),
('Bulk Candy',      'bulk-candy',      'Buy your favorites in bulk and save big',          'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', NULL, 6),
('Retro Candy',     'retro-candy',     'Nostalgic classics from the good old days',        'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400', NULL, 7),
('Lollipops',       'lollipops',       'Swirly, fruity, giant lollipops for all ages',     'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400', NULL, 8);
GO

-- ============================================================
-- BRANDS
-- ============================================================
INSERT INTO Brands (name, slug, logo, description) VALUES
('Haribo',          'haribo',       'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Haribo-logo.svg/200px-Haribo-logo.svg.png', 'The original gummy bear maker since 1920'),
('Skittles',        'skittles',     'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Skittles_logo.svg/200px-Skittles_logo.svg.png', 'Taste the Rainbow'),
('Sour Patch Kids', 'sour-patch',   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sour_Patch_Kids_logo.png/200px-Sour_Patch_Kids_logo.png', 'Sour. Sweet. Gone.'),
('Reese''s',        'reeses',       'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Reese%27s_logo.png/200px-Reese%27s_logo.png', 'Perfect combination of chocolate & peanut butter'),
('M&Ms',            'mms',          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/M%26M%27s_Logo.svg/200px-M%26M%27s_Logo.svg.png', 'Melts in your mouth, not in your hand'),
('Trolli',          'trolli',       'https://upload.wikimedia.org/wikipedia/commons/4/4e/Trolli_logo.png', 'Weird. Wonderfully weird gummies'),
('Airheads',        'airheads',     'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Airheads_logo.svg/200px-Airheads_logo.svg.png', 'Taffy-like candy in bold fruit flavors'),
('Nerds',           'nerds',        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nerds_Logo.png/200px-Nerds_Logo.png', 'Tangy and crunchy tiny candies'),
('Twizzlers',       'twizzlers',    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Twizzlers_Logo.svg/200px-Twizzlers_Logo.svg.png', 'The original licorice twist candy'),
('Jolly Rancher',   'jolly-rancher','https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Jolly_rancher_logo.svg/200px-jolly_rancher_logo.svg.png', 'Famously bold fruit flavors');
GO

-- ============================================================
-- PRODUCTS (30 sản phẩm đa dạng)
-- ============================================================
INSERT INTO Products (name, slug, description, short_desc, price, sale_price, stock, sku, weight, category_id, brand_id, images, tags, is_featured, is_new, avg_rating, review_count, sold_count) VALUES

-- CHOCOLATE (category_id=1)
('Reeses Peanut Butter Cups Big Pack',
 'reeses-pb-cups-big-pack',
 'The ultimate combination of smooth peanut butter wrapped in rich milk chocolate. This jumbo pack contains 16 full-size cups perfect for sharing or keeping all to yourself. Made with Hersheys chocolate and Reeses signature peanut butter blend.',
 'Jumbo 16-pack of classic Reeses peanut butter cups.',
 12.99, 9.99, 150, 'CHO-001', 340, 1, 4,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600","https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600"]',
 'chocolate,peanut butter,reeses,bestseller', 1, 0, 4.8, 142, 890),

('M&Ms Milk Chocolate Sharing Size',
 'mms-milk-chocolate-sharing',
 'Colorful candy-coated milk chocolate pieces in the classic M&Ms style. The sharing size bag is perfect for movie nights, parties, or road trips. Each piece has a crispy candy shell that melts in your mouth.',
 'Classic M&Ms in a generous sharing size bag.',
 8.99, NULL, 200, 'CHO-002', 283, 1, 5,
 '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600"]',
 'chocolate,mms,sharing,classic', 1, 0, 4.7, 98, 650),

('M&Ms Peanut Butter King Size',
 'mms-peanut-butter-king',
 'A king size bag of M&Ms filled with a creamy peanut butter center coated in milk chocolate and that iconic colorful candy shell. A fan favorite twist on the classic.',
 'King size M&Ms with peanut butter filling.',
 6.49, NULL, 175, 'CHO-003', 113, 1, 5,
 '["https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600"]',
 'chocolate,mms,peanut butter,king size', 0, 1, 4.6, 54, 310),

-- GUMMY & CHEWY (category_id=2)
('Haribo Gold Bears 1kg Party Pack',
 'haribo-gold-bears-1kg',
 'The world-famous original gummy bears! Haribo Gold Bears are made with the finest fruit flavors — raspberry, lemon, orange, pineapple, strawberry — in their iconic bear shape. This 1kg party pack is perfect for big gatherings.',
 'The iconic original gummy bears in a huge 1kg bag.',
 14.99, 11.99, 120, 'GUM-001', 1000, 2, 1,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600","https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'gummy,haribo,party,bulk,bears', 1, 0, 4.9, 287, 1240),

('Trolli Sour Brite Crawlers 1lb',
 'trolli-sour-brite-crawlers',
 'These wildly shaped worm gummies from Trolli are covered in sour sugar and come in dual-flavor combinations. Strawberry-lemon, orange-lime, cherry-grape — each worm is a sour-sweet flavor explosion.',
 'Sour worm gummies in wild dual-flavor combos.',
 9.49, NULL, 95, 'GUM-002', 453, 2, 6,
 '["https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=600"]',
 'sour,worms,gummy,trolli,crawlers', 1, 0, 4.6, 112, 480),

('Haribo Happy Cola Gummies 500g',
 'haribo-happy-cola',
 'Cola-flavored gummy candies shaped like tiny soda bottles! Each piece has a tangy, fizzy cola taste that perfectly captures the refreshing flavor. A beloved Haribo classic loved worldwide.',
 'Cola-flavored gummy soda bottles by Haribo.',
 10.99, 8.99, 88, 'GUM-003', 500, 2, 1,
 '["https://images.unsplash.com/photo-1527515545081-5db817172677?w=600"]',
 'cola,gummy,haribo,soda,fizzy', 0, 1, 4.5, 76, 290),

('Airheads Variety Pack 60 Count',
 'airheads-variety-60ct',
 'The ultimate Airheads collection! This 60-count variety pack includes all the classic flavors: cherry, blue raspberry, watermelon, green apple, strawberry, grape, and white mystery. Each individually wrapped bar is the perfect stretchy, taffy-like treat.',
 '60-count variety pack of all classic Airheads flavors.',
 18.99, 15.99, 65, 'GUM-004', 960, 2, 7,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'airheads,variety,taffy,chewy,pack', 1, 0, 4.7, 203, 730),

-- HARD CANDY (category_id=3)
('Jolly Rancher Hard Candy 5lb Bag',
 'jolly-rancher-5lb',
 'Five pounds of the boldest, most intense hard candy flavors ever created. Watermelon, green apple, cherry, grape, and blue raspberry — each piece delivers a massive burst of pure fruit flavor that lasts and lasts.',
 '5 lb bag of assorted Jolly Rancher hard candies.',
 22.99, 19.99, 55, 'HAR-001', 2268, 3, 10,
 '["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'jolly rancher,hard candy,bulk,5lb,assorted', 1, 0, 4.8, 318, 1100),

('Twizzlers Pull-N-Peel Cherry 18oz',
 'twizzlers-pull-n-peel',
 'The iconic Twizzlers Pull-N-Peel in classic cherry flavor! Each piece is made of 8 individual strands you can peel apart one by one. A satisfying and fun way to enjoy this classic American candy.',
 'Classic cherry Twizzlers in the Pull-N-Peel style.',
 7.99, NULL, 140, 'HAR-002', 510, 3, 9,
 '["https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600"]',
 'twizzlers,licorice,cherry,pull peel,classic', 0, 0, 4.3, 67, 290),

('Nerds Rope Original 26 Count',
 'nerds-rope-26ct',
 'A chewy, gummy center rope coated in tiny, tangy Nerds candy. The original Nerds Rope comes in strawberry flavor with those classic crunchy, sweet-and-sour Nerds covering every inch. A childhood classic!',
 'Strawberry Nerds Rope 26-count box.',
 15.99, 12.99, 78, 'HAR-003', 832, 3, 8,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'nerds,rope,strawberry,classic,crunchy', 0, 1, 4.5, 88, 340),

-- SOUR CANDY (category_id=4)
('Sour Patch Kids Original 5lb',
 'sour-patch-kids-5lb',
 'The world''s most popular sour candy in a massive 5-pound bag! Sour Patch Kids start sour, then get sweet — thats why everyone loves them. This bulk bag contains the original mix of red, orange, green, and yellow pieces.',
 'Giant 5 lb bag of original Sour Patch Kids.',
 24.99, 19.99, 42, 'SOU-001', 2268, 4, 3,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600","https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600"]',
 'sour patch,sour,5lb,bulk,bestseller', 1, 0, 4.9, 445, 1890),

('Skittles Original 54oz Party Size',
 'skittles-original-54oz',
 'Taste the Rainbow in this jumbo party-size bag of original Skittles! Each colorful piece has a bright fruit flavor: strawberry, lemon, grape, green apple, orange. Perfectly chewy with a candy shell.',
 'Giant 54oz party bag of original Skittles.',
 19.99, 16.99, 110, 'SOU-002', 1530, 4, 2,
 '["https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=600"]',
 'skittles,rainbow,fruit,party,chewy', 1, 0, 4.7, 231, 870),

('Warheads Extreme Sour 240 Count',
 'warheads-extreme-sour-240ct',
 'The most intense, face-puckering sour candy on the planet! 240 individually wrapped Warheads in all 5 flavors: watermelon, black cherry, apple, lemon, and blue raspberry. Can you handle the extreme sourness?',
 '240-count bag of intense Warheads sour candy.',
 29.99, 24.99, 35, 'SOU-003', 1080, 4, NULL,
 '["https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600"]',
 'warheads,extreme sour,240ct,bulk,intense', 0, 1, 4.8, 176, 560),

-- NOVELTY (category_id=5)
('Kinder Joy Eggs 20 Count Box',
 'kinder-joy-20ct',
 'The beloved Kinder Joy egg features two delicious halves — one filled with smooth cocoa and milk cream with crispy wafer bites, and the other with a fun toy surprise inside. Kids and adults both love them!',
 'Box of 20 Kinder Joy eggs with toy surprise.',
 27.99, NULL, 60, 'NOV-001', 400, 5, NULL,
 '["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'kinder,joy,egg,toy,chocolate,novelty', 1, 0, 4.8, 129, 490),

('Pop Rocks Crackling Candy Variety 24pk',
 'pop-rocks-variety-24pk',
 'The original popping candy! Pop Rocks explode with a crackle and pop the moment they hit your tongue. This variety pack includes strawberry, watermelon, cherry, and grape flavors. 24 packs for maximum popping fun!',
 '24-pack variety of Pop Rocks popping candy.',
 16.99, 13.99, 80, 'NOV-002', 288, 5, NULL,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'pop rocks,popping candy,novelty,variety,crackle', 0, 1, 4.6, 94, 380),

('Fun Dip Lik-M-Aid 48 Count',
 'fun-dip-48ct',
 'Dip and lick your way through this classic American candy experience! Fun Dip comes with sweet powdered candy and the iconic candy stick you use to eat it. 48 count box includes cherry yum diddly, razz apple magic dip.',
 '48-count box of classic Fun Dip candy.',
 21.99, NULL, 45, 'NOV-003', 672, 5, NULL,
 '["https://images.unsplash.com/photo-1527515545081-5db817172677?w=600"]',
 'fun dip,novelty,powder,candy stick,classic', 0, 0, 4.4, 55, 210),

-- BULK (category_id=6)
('Bulk Mixed Candy Bag 5lb Assortment',
 'bulk-mixed-5lb',
 'An epic 5-pound assortment of over 20 different candy types! Includes gummies, chocolates, hard candy, sours, and chewy favorites all mixed together. Perfect for candy bowls, parties, office snacks, or Halloween.',
 'Giant 5 lb mixed candy assortment — 20+ types.',
 26.99, 21.99, 75, 'BLK-001', 2268, 6, NULL,
 '["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600","https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600"]',
 'bulk,mixed,assortment,5lb,party,variety', 1, 0, 4.7, 198, 820),

('Bulk Sour Candy Mix 3lb',
 'bulk-sour-3lb',
 'A dedicated 3-pound bag for the true sour candy fanatics! Packed with Sour Patch Kids, Warheads, Sour Skittles, Sour Punch Straws, and more sour treats. If your mouth isnt puckering, you havent had enough.',
 '3 lb bag dedicated to the best sour candies.',
 19.99, 16.99, 55, 'BLK-002', 1360, 6, NULL,
 '["https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600"]',
 'bulk,sour,3lb,mix,assortment', 0, 1, 4.6, 87, 340),

('Bulk Gummy Mix 2lb',
 'bulk-gummy-2lb',
 'Two full pounds of premium gummy candies! This mix features Haribo Gold Bears, Trolli Worms, peach rings, gummy butterflies, gummy sharks, and more. All the best gummies in one convenient bag.',
 '2 lb premium gummy candy mix.',
 15.99, NULL, 90, 'BLK-003', 908, 6, 1,
 '["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'bulk,gummy,2lb,bears,worms,mix', 0, 0, 4.5, 64, 260),

-- RETRO (category_id=7)
('Candy Necklace Variety Box 200ct',
 'candy-necklace-200ct',
 'The ultimate nostalgic candy accessory! These classic candy necklaces let you wear and eat your sweets at the same time. Each necklace is made of small, sweetly flavored candy beads strung on edible elastic. 200-count display box.',
 '200-count box of retro candy necklaces.',
 34.99, 29.99, 28, 'RET-001', 700, 7, NULL,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'retro,necklace,nostalgic,200ct,wearable', 0, 0, 4.3, 41, 120),

('Ring Pop Variety 100 Count',
 'ring-pop-100ct',
 'The iconic Ring Pop — a hard candy jewel on a ring you can wear and lick! This 100-count variety box includes strawberry, watermelon, cherry, blue raspberry, and grape flavors. A retro favorite that never gets old.',
 '100-count box of assorted Ring Pop lollipops.',
 39.99, 32.99, 22, 'RET-002', 1700, 7, NULL,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'ring pop,retro,lollipop,wearable,100ct', 1, 0, 4.7, 158, 530),

('Pixy Stix Giant 160 Count',
 'pixy-stix-160ct',
 'The original sugar straw candy! Pixy Stix come in colorful paper tubes filled with flavored sugar powder. Rip one open and pour it directly on your tongue for a quick, intense burst of fruity sweetness. 160-count mixed flavors.',
 '160-count box of classic Pixy Stix sugar straws.',
 18.99, 14.99, 48, 'RET-003', 1280, 7, NULL,
 '["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'pixy stix,retro,sugar,straw,powder,nostalgic', 0, 0, 4.4, 73, 290),

-- LOLLIPOPS (category_id=8)
('Charms Blow Pops 100 Count',
 'blow-pops-100ct',
 'The original lollipop with bubblegum inside! Charms Blow Pops start as hard candy and transform into chewy bubblegum at the center. This 100-count jar includes watermelon, cherry, strawberry, and blue razz.',
 '100-count jar of Charms Blow Pops with gum center.',
 28.99, 23.99, 38, 'LLP-001', 2900, 8, NULL,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600","https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=600"]',
 'blow pop,lollipop,bubblegum,100ct,jar', 1, 0, 4.6, 115, 410),

('Tootsie Pop Assorted 100 Count',
 'tootsie-pop-100ct',
 'How many licks does it take to get to the center of a Tootsie Pop? Find out with this 100-count jar of assorted Tootsie Pops! Hard candy shell in fruit flavors surrounds a chewy Tootsie Roll chocolate center.',
 '100-count jar of assorted Tootsie Pop lollipops.',
 24.99, NULL, 44, 'LLP-002', 2800, 8, NULL,
 '["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'tootsie pop,lollipop,chocolate,100ct,classic', 0, 0, 4.5, 89, 320),

('Giant Rainbow Swirl Lollipop 6inch',
 'giant-rainbow-swirl-lollipop',
 'A massive, eye-catching 6-inch swirl lollipop in rainbow colors! This giant candy weighs nearly half a pound and comes in a gorgeous swirl of cherry, strawberry, blue raspberry, lemon, and orange. Perfect as a gift or decoration.',
 'Giant 6-inch rainbow swirl lollipop.',
 7.99, 5.99, 95, 'LLP-003', 227, 8, NULL,
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600"]',
 'giant,lollipop,rainbow,swirl,gift,novelty', 1, 1, 4.8, 203, 780),

-- ADDITIONAL FEATURED ITEMS
('Skittles Sour 3lb Bag',
 'skittles-sour-3lb',
 'All the colorful, fruity goodness of Skittles — now with a sour candy coating! Each piece delivers a sour punch followed by the classic fruity Skittles flavor. This 3-pound bag gives you plenty to share.',
 '3 lb bag of Sour Skittles.',
 17.99, 14.99, 72, 'SOU-004', 1360, 4, 2,
 '["https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=600"]',
 'skittles,sour,3lb,bulk,fruity', 0, 1, 4.7, 133, 510),

('Haribo Goldbears Rainbow 3x1lb Value',
 'haribo-rainbow-3lb-value',
 'Three 1-pound bags of Haribo Gold Bears in a bundled value pack! Get the original, the sour, and the fruit punch varieties all in one purchase. Perfect for stocking the candy bowl or gifting to the gummy fan in your life.',
 'Value 3-pack of Haribo Goldbears (original, sour, fruit punch).',
 21.99, 17.99, 60, 'GUM-005', 1360, 2, 1,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600"]',
 'haribo,gummy,3pack,value,rainbow', 0, 1, 4.6, 91, 380),

('Nerds Gummy Clusters 3lb',
 'nerds-gummy-clusters-3lb',
 'The viral candy sensation! Nerds Gummy Clusters combine a soft, chewy gummy center coated in tiny, crunchy Nerds candy. The perfect mix of textures in every bite. This 3-pound bag is perfect for true fans.',
 '3 lb bag of viral Nerds Gummy Clusters.',
 23.99, 19.99, 85, 'GUM-006', 1360, 2, 8,
 '["https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600","https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600"]',
 'nerds,gummy,clusters,viral,3lb,trending', 1, 1, 4.9, 342, 1480),

('Reeses Pieces 1lb Bag',
 'reeses-pieces-1lb',
 'Peanut butter candy coated in an orange candy shell — the iconic Reeses Pieces! These bite-sized pieces pack all the peanut butter flavor without any chocolate. Great for snacking, baking, or topping ice cream.',
 '1 lb bag of Reeses Pieces peanut butter candy.',
 10.99, 8.99, 130, 'CHO-004', 453, 1, 4,
 '["https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600"]',
 'reeses,pieces,peanut butter,1lb,orange', 0, 0, 4.6, 99, 430),

('Sour Punch Straws Variety 2lb',
 'sour-punch-straws-2lb',
 'Hollow candy straws filled with intense sour powder and surrounded by a chewy candy shell. This 2-pound variety bag includes strawberry, watermelon, blue raspberry, and apple flavors. Fun to eat, impossible to stop!',
 '2 lb variety bag of Sour Punch Straws.',
 14.99, 11.99, 68, 'SOU-005', 908, 4, NULL,
 '["https://images.unsplash.com/photo-1559715541-5daf5b971bb3?w=600"]',
 'sour punch,straws,sour,2lb,variety', 0, 1, 4.5, 77, 300);
GO

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO Reviews (product_id, user_id, rating, comment) VALUES
(1,  2, 5, 'Absolutely delicious! The peanut butter to chocolate ratio is perfect.'),
(1,  3, 5, 'Best bulk candy purchase I''ve ever made. Fresh and delicious!'),
(4,  2, 5, 'The original and still the best. My kids go crazy for these!'),
(4,  4, 4, 'Great gummies, super fresh. Arrived well sealed and on time.'),
(7,  3, 5, 'All 60 pieces were individually wrapped. Amazing value!'),
(11, 2, 5, 'Sour Patch Kids in bulk is DANGEROUS. I cannot stop eating these.'),
(11, 4, 5, 'Perfect blend of sour and sweet. Will definitely reorder.'),
(28, 2, 5, 'Nerds Clusters are so addictive! The texture combo is incredible.'),
(28, 3, 5, 'Ordered these three times now. The best candy out there right now.'),
(25, 4, 5, 'The giant lollipop is beautiful and tastes amazing! Great gift idea.');
GO

-- ============================================================
-- BANNERS
-- ============================================================
INSERT INTO Banners (title, subtitle, image, link, btn_text, position, sort_order) VALUES
('Free Shipping on Orders Over $99!',
 'Shop the freshest candy shipped fast across the USA',
 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1400',
 '/shop', 'Shop Now', 'hero', 1),

('Sour Candy Bonanza 🍋',
 'Up to 30% off all sour candy this week only',
 'https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=1400',
 '/categories/sour-candy', 'Explore Sours', 'hero', 2),

('Haribo Party Pack Sale',
 'Stock up on Gold Bears — Buy 2 Get 1 Free',
 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1400',
 '/brands/haribo', 'Shop Haribo', 'hero', 3),

('New Arrivals Just Dropped 🎉',
 'Check out the hottest new candy trends',
 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=1400',
 '/shop?filter=new', 'See New Arrivals', 'hero', 4);
GO

-- ============================================================
-- SAMPLE CART (guest)
-- ============================================================
INSERT INTO Carts (session_id) VALUES ('guest-session-demo-001');
INSERT INTO CartItems (cart_id, product_id, quantity) VALUES
(1, 4, 2),
(1, 11, 1),
(1, 28, 1);
GO

-- ============================================================
-- SAMPLE ORDER
-- ============================================================
INSERT INTO Orders (user_id, order_number, status, subtotal, shipping_fee, discount, total,
    recipient_name, recipient_phone, shipping_address, city, state, zip_code, country, payment_method, payment_status) VALUES
(2, 'ORD-20240001', 'delivered', 49.97, 0.00, 0.00, 49.97,
 'Alice Johnson', '555-0101', '123 Maple Street', 'Los Angeles', 'CA', '90001', 'US', 'credit_card', 'paid');

INSERT INTO OrderItems (order_id, product_id, product_name, product_img, quantity, unit_price, total_price) VALUES
(1, 4,  'Haribo Gold Bears 1kg Party Pack',  'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', 1, 14.99, 14.99),
(1, 11, 'Sour Patch Kids Original 5lb',       'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', 1, 24.99, 24.99),
(1, 28, 'Nerds Gummy Clusters 3lb',           'https://images.unsplash.com/photo-1600881961012-56c5c2d64ce9?w=600', 1, 23.99, 23.99);
GO

PRINT '✅ CandyStoreDB Schema + Seed Data created successfully!';
PRINT '📊 Tables: Users(4), Categories(8), Brands(10), Products(30), Reviews(10), Banners(4)';
GO