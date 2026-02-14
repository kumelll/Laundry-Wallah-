const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize database before loading routes
try {
  require('./db/init');
} catch (err) {
  console.error('Database init failed:', err.message);
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow all origins (required when frontend/backend on different domains)
app.use(cors({ origin: true, credentials: true }));

// Health check for deployment verification
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Laundry Wallah API is running' });
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(path.join(__dirname)));

app.get(['/user/dashboard', '/user/orders', '/user/new-order', '/admin/dashboard', '/admin/orders'], (req, res) => {
  const p = req.path.startsWith('/admin') ? path.join(__dirname, 'admin', path.basename(req.path) + '.html') : path.join(__dirname, 'user', path.basename(req.path) + '.html');
  res.sendFile(p);
});

app.listen(PORT, () => {
  console.log('Laundry Wallah server running at http://localhost:' + PORT);
  console.log('Open http://localhost:' + PORT + ' in your browser.');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' is already in use. Try: set PORT=3001 && node server.js');
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});
