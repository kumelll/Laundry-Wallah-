const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const DELIVERY_FEE = 50;

router.get('/', requireAuth, (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  const orders = db.getOrdersByUserId(req.user.id);
  res.json(orders);
});

router.get('/:id', requireAuth, (req, res) => {
  const order = db.getOrderById(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = JSON.parse(order.items || '[]');
  const expanded = items.map(it => {
    const svc = db.getServiceById(it.service_id);
    return { ...it, name: svc ? svc.name : 'Item', price_per_item: svc ? svc.price_per_item : 0 };
  });
  res.json({ ...order, items: expanded });
});

router.post('/', requireAuth, (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  const { pickup_date, pickup_slot, drop_date, drop_slot, items, address } = req.body;
  if (!pickup_date || !pickup_slot || !drop_date || !drop_slot || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'pickup_date, pickup_slot, drop_date, drop_slot, items (array) required' });
  }
  let total = DELIVERY_FEE;
  for (const item of items) {
    if (item.service_id && item.quantity > 0) {
      const svc = db.getServiceById(item.service_id);
      if (svc) total += svc.price_per_item * item.quantity;
    }
  }
  if (total <= DELIVERY_FEE) {
    return res.status(400).json({ error: 'Add at least one item' });
  }
  const order = db.createOrder({
    user_id: req.user.id,
    pickup_date,
    pickup_slot,
    drop_date,
    drop_slot,
    items: JSON.stringify(items),
    total_amount: total,
    address: address || ''
  });
  res.status(201).json(order);
});

module.exports = router;
