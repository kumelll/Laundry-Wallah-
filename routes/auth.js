const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name, phone, address } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password and name are required' });
  }
  const emailNorm = String(email).trim().toLowerCase();
  if (db.getUserByEmail(emailNorm)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const user = db.createUser({
    email: emailNorm,
    password_hash: hash,
    name: String(name).trim(),
    phone: String(phone || '').trim(),
    address: String(address || '').trim(),
    role: 'user'
  });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const emailNorm = String(email).trim().toLowerCase();
  const user = db.getUserByEmail(emailNorm, 'user');
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
});

router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const emailNorm = String(email).trim().toLowerCase();
  const user = db.getUserByEmail(emailNorm, 'admin');
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
});

module.exports = router;
