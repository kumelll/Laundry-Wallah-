const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.getServices();
  res.json(rows);
});

module.exports = router;
