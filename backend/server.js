const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Завантаження конфігурації
require('./config/database');

// Імпорт middleware та маршрутів
const { requestLogger } = require('./middleware/logger');
const apiRoutes = require('./routes/index');

// Завантаження змінних середовища
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Збільшуємо ліміт для завантаження зображень

// Логування запитів
app.use(requestLogger);

// API маршрути
app.use('/api', apiRoutes);

// Обробка неіснуючих маршрутів
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не знайдено' 
  });
});

// Глобальна обробка помилок
app.use((error, req, res, next) => {
  console.error('Глобальна помилка:', error);
  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📡 API доступне за адресою: http://localhost:${PORT}/api`);
  console.log(`🏥 Перевірка здоров'я: http://localhost:${PORT}/api/health`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  УВАГА: Не встановлено OPENAI_API_KEY у файлі .env');
  }
});

module.exports = app;