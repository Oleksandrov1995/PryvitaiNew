const express = require('express');
const { generateImagePrompt, generateGreeting } = require('../controllers/openaiController');

const router = express.Router();

// Маршрут для генерації зображення промпта
router.post('/generate-image-promt', generateImagePrompt);

// Маршрут для генерації привітань
router.post('/generate-greeting', generateGreeting);

module.exports = router;
