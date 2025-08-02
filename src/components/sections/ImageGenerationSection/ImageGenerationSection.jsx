import React, { useState, forwardRef } from "react";
import "./ImageGenerationSection.css";
import { dalleImagePrompt } from "../../../prompts/openai/dalleImagePrompt";

const ImageGenerationSection = forwardRef(({ onImageGenerated, scrollToNextSection, formData }, ref) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState("");
  const [makeComStatus, setMakeComStatus] = useState("");

  const generateImage = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedPrompt("");
    setImageUrl("");
    setGeneratedImageUrl("");
    setCurrentStep("");
    setMakeComStatus("");
    
    try {
      console.log('FormData для генерації зображення:', formData);
      
      let photoUrl = "";
      
      // Крок 1: Завантаження фото на Cloudinary (якщо є фото)
      if (formData.photo) {
        setCurrentStep("Завантажую фото на Cloudinary...");
        
        // Перетворюємо файл в base64
        const convertToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        };

        const photoBase64 = await convertToBase64(formData.photo);
        
        const uploadResponse = await fetch('http://localhost:5000/api/upload-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            photoBase64: photoBase64 
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Помилка при завантаженні фото');
        }

        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.url;
        setImageUrl(photoUrl);
        
        console.log('Фото завантажено на Cloudinary:', photoUrl);
      }
      
      // Крок 2: Генерація промпта з URL фото
      setCurrentStep("Генерую промпт для зображення...");
      
      const formDataWithUrl = {
        ...formData,
        photoUrl: photoUrl
      };
      
      const prompt = dalleImagePrompt(formDataWithUrl);
      console.log('Промпт для DALL-E:', prompt);
      
      const response = await fetch('http://localhost:5000/api/generate-image-promt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Помилка при генерації промпта');
      }

      const data = await response.json();
      
      if (data.generatedPrompt) {
        setGeneratedPrompt(data.generatedPrompt);
        
        // Крок 3: Генерація зображення через Make.com webhook
        if (photoUrl) {
          setCurrentStep("Генерую фінальне зображення...");
          setMakeComStatus("Відправляю запит до Make.com...");
          
          try {
            console.log('Відправляю запит до Make.com webhook...');
            
            // Спробуємо FormData формат
            const formData = new FormData();
            formData.append('prompt', data.generatedPrompt);
            formData.append('imageUrl', photoUrl);
            formData.append('style', formDataWithUrl.cardStyle);
            formData.append('mood', formDataWithUrl.cardMood);
            formData.append('hobby', formDataWithUrl.hobby);
            formData.append('trait', formDataWithUrl.trait);
            formData.append('greeting', formDataWithUrl.greetingText);
            
            console.log('Дані для Make.com (FormData):', {
              prompt: data.generatedPrompt,
              imageUrl: photoUrl,
              style: formDataWithUrl.cardStyle,
              mood: formDataWithUrl.cardMood,
              hobby: formDataWithUrl.hobby,
              trait: formDataWithUrl.trait,
              greeting: formDataWithUrl.greetingText
            });
            
            const imageGenerationResponse = await fetch('https://hook.eu2.make.com/o8eoc69ifeo4ne9pophf1io4q30wm23c', {
              method: 'POST',
              body: formData, // відправляємо як FormData
            });

            console.log('Статус відповіді Make.com:', imageGenerationResponse.status);
            console.log('Headers відповіді:', imageGenerationResponse.headers);

            if (imageGenerationResponse.ok) {
              const responseText = await imageGenerationResponse.text();
              console.log('Відповідь від Make.com (text):', responseText);
              
              // Якщо відповідь - це просто URL зображення
              if (responseText && (responseText.startsWith('http') || responseText.startsWith('"http'))) {
                const generatedImageUrl = responseText.trim().replace(/"/g, ''); // видаляємо лапки якщо є
                setGeneratedImageUrl(generatedImageUrl);
                setMakeComStatus("✅ Зображення успішно згенеровано!");
                
                if (onImageGenerated) {
                  onImageGenerated("finalGeneratedImageUrl", generatedImageUrl);
                }
              } else {
                // Спробуємо парсити як JSON
                try {
                  const imageData = JSON.parse(responseText);
                  console.log('Дані від Make.com (JSON):', imageData);
                  
                  if (imageData.generatedImageUrl) {
                    setGeneratedImageUrl(imageData.generatedImageUrl);
                    setMakeComStatus("✅ Зображення успішно згенеровано!");
                    
                    if (onImageGenerated) {
                      onImageGenerated("finalGeneratedImageUrl", imageData.generatedImageUrl);
                    }
                  } else {
                    console.warn('Make.com повернув дані без generatedImageUrl:', imageData);
                    setMakeComStatus("⚠️ Make.com повернув відповідь без URL зображення");
                  }
                } catch (parseError) {
                  console.warn('Не вдалося парсити відповідь Make.com як JSON:', parseError);
                  setMakeComStatus("⚠️ Make.com повернув нечитабельну відповідь");
                }
              }
            } else {
              const errorText = await imageGenerationResponse.text();
              console.error('Помилка Make.com response:', {
                status: imageGenerationResponse.status,
                statusText: imageGenerationResponse.statusText,
                body: errorText
              });
              setMakeComStatus(`❌ Помилка Make.com: ${imageGenerationResponse.status} ${imageGenerationResponse.statusText}`);
              console.warn('Помилка при генерації фінального зображення через Make.com');
            }
          } catch (makeError) {
            console.error('Помилка Make.com webhook:', makeError);
            console.error('Деталі помилки:', {
              name: makeError.name,
              message: makeError.message,
              stack: makeError.stack
            });
            setMakeComStatus(`❌ Помилка підключення до Make.com: ${makeError.message}`);
            // Не зупиняємо процес, якщо Make.com недоступний
          }
        }
        
        setCurrentStep("Готово!");
        
        if (onImageGenerated) {
          onImageGenerated("generatedImagePrompt", data.generatedPrompt);
          if (photoUrl) {
            onImageGenerated("imageUrl", photoUrl);
          }
        }
        
        // Автоскрол після успішної генерації
        if (scrollToNextSection) {
          setTimeout(() => scrollToNextSection(), 1000);
        }
      }
      
    } catch (error) {
      console.error('Помилка генерації зображення:', error);
      setError('Виникла помилка при генерації зображення. Спробуйте ще раз.');
      setCurrentStep("");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormComplete = () => {
    return formData.cardStyle && 
           formData.cardMood && 
           formData.greetingText && 
           (formData.hobby || formData.trait);
  };

  return (
    <section ref={ref} className="image-generation-section">
      <h2>Генерація зображення</h2>
      <p className="description">
        На основі ваших відповідей ми створимо унікальний промпт для генерації персоналізованого зображення.
      </p>

      <div className="generation-container">
        <div className="form-summary">
          <h4>📋 Дані для генерації:</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Стиль:</span>
              <span className="value">{formData.cardStyle || "Не вказано"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Настрій:</span>
              <span className="value">{formData.cardMood || "Не вказано"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Атрибути:</span>
              <span className="value">{formData.hobby || "Не вказано"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Риси:</span>
              <span className="value">{formData.trait || "Не вказано"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Привітання:</span>
              <span className="value">{formData.greetingText ? `${formData.greetingText.substring(0, 50)}...` : "Не вказано"}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={generateImage}
          disabled={isGenerating || !isFormComplete()}
          className={`generate-image-button ${!isFormComplete() ? 'disabled' : ''}`}
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner"></span>
              {currentStep || "Генерую..."}
            </>
          ) : (
            '🎨 Згенерувати зображення'
          )}
        </button>

        {!isFormComplete() && (
          <div className="warning-message">
            <p>⚠️ Для генерації зображення потрібно заповнити всі попередні секції</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {makeComStatus && (
          <div className="make-com-status">
            <p>{makeComStatus}</p>
          </div>
        )}

        {(generatedPrompt || imageUrl || generatedImageUrl) && (
          <div className="generated-result">
            <h4>✅ Дані для створення листівки готові!</h4>
            
            {imageUrl && (
              <div className="image-result">
                <p><strong>📸 URL завантаженого фото:</strong></p>
                <div className="url-display">
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="image-link">
                    {imageUrl}
                  </a>
                </div>
                <div className="image-preview">
                  <img src={imageUrl} alt="Завантажене фото" className="preview-image" />
                </div>
              </div>
            )}
            
            {generatedPrompt && (
              <div className="prompt-display">
                <p><strong>🎨 Згенерований промпт:</strong></p>
                <div className="prompt-text">
                  {generatedPrompt}
                </div>
              </div>
            )}
            
            {generatedImageUrl && (
              <div className="final-image-result">
                <p><strong>🖼️ Фінальне згенероване зображення:</strong></p>
                <div className="url-display">
                  <a href={generatedImageUrl} target="_blank" rel="noopener noreferrer" className="image-link">
                    {generatedImageUrl}
                  </a>
                </div>
                <div className="image-preview">
                  <img src={generatedImageUrl} alt="Згенероване зображення" className="preview-image" />
                </div>
              </div>
            )}
            
            <div className="next-steps">
              <p>💡 Тепер у вас є всі дані для створення персоналізованої листівки!</p>
              {imageUrl && generatedPrompt && (
                <p>🎉 URL фото та промпт готові для генерації унікального зображення!</p>
              )}
              {generatedImageUrl && (
                <p>🌟 Фінальне зображення успішно згенеровано!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default ImageGenerationSection;
