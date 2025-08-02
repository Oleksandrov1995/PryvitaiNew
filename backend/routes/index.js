const express = require('express');
const photoRoutes = require('./photoRoutes');
const openaiRoutes = require('./openaiRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Підключаємо маршрути
router.use('/', photoRoutes);
router.use('/', openaiRoutes);
router.use('/', healthRoutes);

module.exports = router;
