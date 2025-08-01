import React, { useState, forwardRef } from "react";
import "./TraitsSection.css";
import { optionsTraits } from "../../../data/options";

const TraitsSection = forwardRef(({ onTraitChange, scrollToNextSection }, ref) => {
  const [selectedTrait, setSelectedTrait] = useState("");
  const [customTrait, setCustomTrait] = useState("");

  const handleTraitSelect = (trait) => {
    setSelectedTrait(trait);
    setCustomTrait("");
    
    if (onTraitChange) {
      onTraitChange("trait", trait);
    }
    
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomTraitChange = (value) => {
    setCustomTrait(value);
    setSelectedTrait("");
    
    if (onTraitChange) {
      onTraitChange("trait", value);
    }
  };

  return (
    <section ref={ref} className="traits-section">
      <h2>Риси та цінності</h2>
      
      <div className="traits-options">
        {optionsTraits.map((trait) => (
          <button
            key={trait}
            type="button"
            onClick={() => handleTraitSelect(trait)}
            className={`trait-button ${selectedTrait === trait && customTrait === "" ? "active" : ""}`}
          >
            {trait}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш варіант риси (наприклад: креативність)"
        value={customTrait}
        onChange={(e) => handleCustomTraitChange(e.target.value)}
        className="custom-trait-input"
      />
    </section>
  );
});

export default TraitsSection;
