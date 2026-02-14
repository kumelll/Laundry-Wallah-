const express = require('express');
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/orders', (req, res) => {
  const orders = db.getAllOrders();
  res.json(orders);
});

router.get('/stats', (req, res) => {
  res.json(db.getStats());
});

router.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'pickup_scheduled', 'clothes_picked_up', 'washing_completed', 'out_for_delivery', 'delivered'];
  if (!status || !valid.includes(status)) {
    return res.status(400).json({ error: 'Valid status required' });
  }
  const order = db.updateOrderStatus(id, status);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

module.exports = router;
