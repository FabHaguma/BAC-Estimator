// src/components/PersonalInfoColumn.jsx
import React, { useState } from 'react';
import StepperInput from './StepperInput';

function PersonalInfoColumn({
  weight,
  time,
  onWeightChange,
  onTimeChange,
  onWeightStep,
  onTimeStep,
  presetDrinksData,
  onAddPreset
}) {
  const [selectedPresetKey, setSelectedPresetKey] = useState(""); // Index as string
  const [presetQuantity, setPresetQuantity] = useState("1");

  const handleAddPresetClick = () => {
    if (!selectedPresetKey) {
      alert("Please select a preset drink from the list.");
      return;
    }
    const quantityNum = parseInt(presetQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity for the preset drink.");
      return;
    }

    const presetData = presetDrinksData[parseInt(selectedPresetKey)];
    if (!presetData) {
        alert("There was an error adding the preset drink.");
        return;
    }
    
    onAddPreset(presetData, quantityNum); // Call the handler from App.jsx
    
    setSelectedPresetKey(""); 
    setPresetQuantity("1"); 
  };

  return (
    <div className="column" id="personalInfoColumn">
      <h2>Your Details</h2>
      <StepperInput
        label="Your Weight (kg)"
        id="weight"
        value={weight}
        onChange={onWeightChange}
        onStep={onWeightStep}
        min="30"
        max="250"
        step="5" // HTML5 step attribute
        stepAmount={5} // Amount for our onStep function
      />
      <StepperInput
        label="Time Since First Drink (Hours)"
        id="time"
        value={time}
        onChange={onTimeChange}
        onStep={onTimeStep}
        min="0"
        max="24"
        step="0.5" // HTML5 step attribute
        stepAmount={0.5} // Amount for our onStep function
      />

      <h3 className="section-title">Quick Add Common Drinks</h3>
      <div className="input-group">
        <label htmlFor="presetDrink">Select:</label>
        <select 
          id="presetDrink" 
          value={selectedPresetKey} 
          onChange={(e) => setSelectedPresetKey(e.target.value)}
        >
          <option value="">-- Choose a drink --</option>
          {presetDrinksData.map((drink, index) => (
            <option key={index} value={index.toString()}>
              {drink.name} {drink.details}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="presetQuantity">Quantity:</label>
        <input 
          type="number" 
          id="presetQuantity" 
          value={presetQuantity} 
          onChange={(e) => setPresetQuantity(e.target.value)} 
          min="1" 
        />
      </div>
      <button 
        type="button" 
        className="button add-preset-button" 
        onClick={handleAddPresetClick}
      >
        + Add Selected Preset(s)
      </button>
    </div>
  );
}

export default PersonalInfoColumn;