const db = require('../db/database');
const bcrypt = require('bcryptjs');

// Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price_per_item INTEGER NOT NULL,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pickup_date TEXT NOT NULL,
    pickup_slot TEXT NOT NULL,
    drop_date TEXT NOT NULL,
    drop_slot TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN (
      'pending', 'pickup_scheduled', 'clothes_picked_up',
      'washing_completed', 'out_for_delivery', 'delivered'
    )),
    address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed services (predefined rates)
const services = [
  { name: 'Shirt/T-shirt', price_per_item: 30, category: 'clothes' },
  { name: 'Jeans/Trousers', price_per_item: 50, category: 'clothes' },
  { name: 'Bedsheet Single', price_per_item: 80, category: 'bedding' },
  { name: 'Bedsheet Double', price_per_item: 120, category: 'bedding' },
  { name: 'Towel', price_per_item: 40, category: 'bedding' },
  { name: 'Saree/Delicate', price_per_item: 100, category: 'delicate' },
  { name: 'Jacket/Coat', price_per_item: 80, category: 'clothes' }
];

const count = db.prepare('SELECT COUNT(*) as c FROM services').get();
if (count.c === 0) {
  const insertService = db.prepare('INSERT INTO services (name, price_per_item, category) VALUES (?, ?, ?)');
  for (const s of services) {
    insertService.run(s.name, s.price_per_item, s.category);
  }
  console.log('Services seeded.');
}

// Seed one admin user (password: admin123)
const adminEmail = 'admin@laundrywallah.com';
const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password_hash, name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)')
    .run(adminEmail, hash, 'Admin', '', '', 'admin');
  console.log('Admin user created: admin@laundrywallah.com / admin123');
}

console.log('Database initialized.');
db.close();
