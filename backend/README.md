# Pryvitai Backend

Backend сервер для додатку Pryvitai - генерація персоналізованих привітань за допомогою OpenAI API.

## 🚀 Швидкий старт

### Встановлення залежностей
```bash
npm install
```

### Налаштування змінних середовища
Переконайтеся, що файл `.env` містить всі необхідні змінні:

```env
# OpenAI API settings
OPENAI_API_KEY=your_openai_api_key_here

# Server settings
PORT=5000
NODE_ENV=development

# CRM API settings
CRM_API_KEY=your_crm_api_key

# Fondy Payment settings
FONDY_MERCHANT_ID=your_merchant_id
FONDY_SECRET_KEY=your_secret_key

# Cloudinary settings
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Запуск сервера

#### Продакшн режим
```bash
npm start
```

#### Режим розробки (з автоперезапуском)
```bash
npm run dev
```

## 📡 API Ендпоінти

### Генерація привітань
- **URL**: `/api/generate-greeting`
- **Метод**: `POST`
- **Тіло запиту**:
```json
{
  "prompt": "Промпт для генерації привітань"
}
```
- **Відповідь**:
```json
{
  "greetings": [
    "Привітання 1",
    "Привітання 2",
    "Привітання 3",
    "Привітання 4",
    "Привітання 5"
  ]
}
```

### Перевірка здоров'я сервера
- **URL**: `/api/health`
- **Метод**: `GET`
- **Відповідь**:
```json
{
  "status": "OK",
  "message": "Сервер працює",
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

## 🛠️ Технології

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - Генерація тексту
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Управління змінними середовища

## 🔧 Розробка

### Структура проекту
```
backend/
├── server.js          # Основний файл сервера
├── package.json        # Залежності та скрипти
├── .env               # Змінні середовища (не включається в git)
└── README.md          # Документація
```

### Обробка помилок
Сервер включає комплексну обробку помилок:
- Валідація вхідних даних
- Обробка помилок OpenAI API
- Логування всіх запитів
- Graceful error handling

## 🔐 Безпека

- Всі чутливі дані зберігаються у змінних середовища
- CORS налаштований для безпечного доступу з фронтенду
- Валідація вхідних даних
- Rate limiting можна додати за потреби

## 📝 Логування

Сервер логує:
- Всі вхідні HTTP запити
- Запити до OpenAI API
- Помилки та винятки
- Стан запуску сервера
