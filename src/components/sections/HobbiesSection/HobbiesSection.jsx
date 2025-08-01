import React, { useState, forwardRef } from "react";
import "./HobbiesSection.css";
import { optionsHobbies } from "../../../data/options";

const HobbiesSection = forwardRef(({ onHobbyChange, scrollToNextSection }, ref) => {
  const [selectedHobby, setSelectedHobby] = useState("");
  const [customHobby, setCustomHobby] = useState("");

  const handleHobbySelect = (hobby) => {
    setSelectedHobby(hobby);
    setCustomHobby("");
    
    if (onHobbyChange) {
      onHobbyChange("hobby", hobby);
    }
    
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomHobbyChange = (value) => {
    setCustomHobby(value);
    setSelectedHobby("");
    
    if (onHobbyChange) {
      onHobbyChange("hobby", value);
    }
  };

  return (
    <section ref={ref} className="hobbies-section">
      <h2>Атрибути та символи</h2>
      
      <div className="hobbies-options">
        {optionsHobbies.map((hobby) => (
          <button
            key={hobby}
            type="button"
            onClick={() => handleHobbySelect(hobby)}
            className={`hobby-button ${selectedHobby === hobby && customHobby === "" ? "active" : ""}`}
          >
            {hobby}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш варіант (наприклад: колекціонування монет)"
        value={customHobby}
        onChange={(e) => handleCustomHobbyChange(e.target.value)}
        className="custom-hobby-input"
      />
    </section>
  );
});

export default HobbiesSection;
