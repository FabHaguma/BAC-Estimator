// src/components/DrinksInputColumn.jsx
import React, { useState } from 'react';
import DrinkList from './DrinkList'; // Import the DrinkList component

function DrinksInputColumn({ drinks, onAddManualDrink, onRemoveDrink }) {
  const [numDrinks, setNumDrinks] = useState("1");
  const [glassSize, setGlassSize] = useState("330");
  const [abv, setAbv] = useState("5");

  const handleAddClick = () => {
    const num = parseInt(numDrinks);
    const size = parseFloat(glassSize);
    const alcoholByVolume = parseFloat(abv);

    if (isNaN(num) || num <= 0 || isNaN(size) || size <= 0 || isNaN(alcoholByVolume) || alcoholByVolume < 0) {
      alert("Please enter valid positive numbers for all manual drink fields (ABV can be 0 or more).");
      return;
    }
    
    // Pass an object with the drink details to the handler in App.jsx
    onAddManualDrink({ num, size, abv: alcoholByVolume }); 
    
    // Optionally clear manual inputs (or decide if App.jsx should manage this)
    // setNumDrinks("1");
    // setGlassSize("330");
    // setAbv("5");
  };

  return (
    <div className="column" id="drinksColumn">
      <h2>Manage Drinks</h2>
      <h3 className="section-title">Add Drink Manually</h3>
      <div className="manual-drink-inputs-row">
        <div className="input-group">
          <label htmlFor="numDrinks">Number of drinks</label>
          <input
            type="number"
            id="numDrinks"
            value={numDrinks}
            onChange={(e) => setNumDrinks(e.target.value)}
            min="1"
            placeholder="e.g., 1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="glassSize">Serving Size (ml)</label>
          <input
            type="number"
            id="glassSize"
            value={glassSize}
            onChange={(e) => setGlassSize(e.target.value)}
            min="1"
            placeholder="e.g., 330"
          />
        </div>
        <div className="input-group">
          <label htmlFor="abv">ABV (%)</label>
          <input
            type="number"
            id="abv"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
            min="0" // Allow 0 for non-alcoholic mixers if desired, though BAC calc would be 0
            step="0.1"
            placeholder="e.g., 5"
          />
        </div>
      </div>
      <button 
        type="button" 
        className="button add-drink-button" 
        onClick={handleAddClick}
      >
        + Add Manual Drink(s)
      </button>

      <h3 className="section-title">Consumed Drinks</h3>
      <div id="drinkListContainer">
        <DrinkList drinks={drinks} onRemoveDrink={onRemoveDrink} />
      </div>
    </div>
  );
}

export default DrinksInputColumn;