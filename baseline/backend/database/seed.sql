-- Seed users (password for all: password123)
INSERT INTO users (username, email, password_hash, is_premium, is_admin) VALUES
  ('admin', 'admin@example.com', '$2b$10$xyDiBwYembqR6UU1wyH3BOok3fSwIZDyMlNneL3Olz0Q50MMOpUxS', 1, 1),
  ('alice', 'alice@example.com', '$2b$10$xyDiBwYembqR6UU1wyH3BOok3fSwIZDyMlNneL3Olz0Q50MMOpUxS', 1, 0),
  ('bob', 'bob@example.com', '$2b$10$xyDiBwYembqR6UU1wyH3BOok3fSwIZDyMlNneL3Olz0Q50MMOpUxS', 0, 0),
  ('charlie', 'charlie@example.com', '$2b$10$xyDiBwYembqR6UU1wyH3BOok3fSwIZDyMlNneL3Olz0Q50MMOpUxS', 0, 0);

-- Seed products
INSERT INTO products (name, description, price, stock, category) VALUES
  ('Laptop Pro 15', 'High-performance laptop with 16GB RAM', 1299.99, 50, 'Electronics'),
  ('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 200, 'Electronics'),
  ('Mechanical Keyboard', 'RGB mechanical keyboard', 149.99, 100, 'Electronics'),
  ('USB-C Hub', '7-in-1 USB-C hub adapter', 49.99, 150, 'Electronics'),
  ('Laptop Stand', 'Adjustable aluminum laptop stand', 39.99, 80, 'Accessories'),
  ('Webcam HD', '1080p webcam with microphone', 79.99, 120, 'Electronics'),
  ('Headphones Pro', 'Noise-canceling headphones', 299.99, 60, 'Electronics'),
  ('Desk Lamp', 'LED desk lamp with wireless charging', 59.99, 90, 'Accessories'),
  ('Monitor 27"', '4K Ultra HD monitor', 449.99, 40, 'Electronics'),
  ('Phone Stand', 'Adjustable phone stand', 19.99, 250, 'Accessories'),
  ('Cable Organizer', 'Desk cable management system', 24.99, 180, 'Accessories'),
  ('Portable SSD', '1TB portable solid state drive', 129.99, 110, 'Electronics'),
  ('Graphics Tablet', 'Digital drawing tablet', 199.99, 70, 'Electronics'),
  ('Bluetooth Speaker', 'Waterproof portable speaker', 89.99, 140, 'Electronics'),
  ('Smart Watch', 'Fitness tracking smartwatch', 249.99, 85, 'Electronics');

-- Seed reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  (1, 2, 5, 'Excellent laptop, very fast!'),
  (1, 3, 4, 'Good performance but a bit pricey'),
  (2, 2, 5, 'Perfect mouse, very comfortable'),
  (3, 3, 5, 'Love the RGB lighting'),
  (4, 4, 4, 'Works great with my laptop'),
  (7, 2, 5, 'Best headphones I have ever owned'),
  (9, 3, 5, 'Amazing display quality');

-- Seed some carts
INSERT INTO carts (user_id) VALUES (2), (3), (4);

-- Seed cart items
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (2, 3, 1),
  (2, 4, 1),
  (3, 7, 1);
