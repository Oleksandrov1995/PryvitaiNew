import React, { useState, forwardRef } from "react";
import "./GreetingTextSection.css";

const GreetingTextSection = forwardRef(({ onTextChange, scrollToNextSection }, ref) => {
  const [greetingText, setGreetingText] = useState("");
  const maxLength = 500;

  const handleTextChange = (value) => {
    if (value.length <= maxLength) {
      setGreetingText(value);
      
      if (onTextChange) {
        onTextChange("greetingText", value);
      }

      // Автоматичний скрол після введення достатньої кількості тексту
      if (value.length >= 20 && scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 1000);
      }
    }
  };

  const handleExampleClick = (example) => {
    handleTextChange(example);
  };

  const getCharacterCountClass = () => {
    const remaining = maxLength - greetingText.length;
    if (remaining < 50) return 'error';
    if (remaining < 100) return 'warning';
    return '';
  };

  return (
    <section ref={ref} className="greeting-text-section">
      <h2>Текст привітання</h2>
      <p className="description">
        Напишіть особисте привітання або побажання. Це буде основний текст вашої картки.
      </p>

      <div className="greeting-text-container">
        <textarea
          value={greetingText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Введіть ваш текст привітання тут... Наприклад: 'Щиро вітаю з днем народження! Бажаю здоров'я, щастя та успіхів!'"
          className="greeting-textarea"
          maxLength={maxLength}
        />
        
        <div className="character-counter">
          <span>Мінімум 20 символів для продовження</span>
          <span className={`character-count ${getCharacterCountClass()}`}>
            {greetingText.length}/{maxLength}
          </span>
        </div>

     <button>Згенерувати ідеї привітання </button>

        <div className="greeting-tips">
          <h4>💡 Поради для написання привітання:</h4>
          <ul>
            <li>Використовуйте особисті звернення та імена</li>
            <li>Додайте щирі побажання та емоції</li>
            <li>Згадайте спільні спогади або особливі моменти</li>
            <li>Пишіть від серця - це найважливіше!</li>
            <li>Перевірте текст на помилки перед завершенням</li>
          </ul>
        </div>
      </div>
    </section>
  );
});

export default GreetingTextSection;
