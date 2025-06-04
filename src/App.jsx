// src/App.jsx
import React, { useState } from 'react';

const ALCOHOL_DENSITY = 0.789; // g/ml
const ELIMINATION_RATE = 0.015; // % per hour

const PRESET_DRINKS_DATA = [
  { name: "Heineken", details: "(330ml, 5%)", size: 330, abv: 5 },
  { name: "Mützig", details: "(330ml, 5.5%)", size: 330, abv: 5.5 },
  { name: "Skol Lager", details: "(500ml, 5.1%)", size: 500, abv: 5.1 },
  { name: "Primus", details: "(500ml, 5%)", size: 500, abv: 5 },
  { name: "Waragi", details: "(Shot 50ml, 40%)", size: 50, abv: 40 },
  { name: "Amarula", details: "(50ml, 17%)", size: 50, abv: 17 },
  { name: "Akarusho", details: "(330ml, 14%)", size: 330, abv: 14 },
  { name: "Exo", details: "(250ml, 18%)", size: 250, abv: 18 },
];

function App() {
  const [drinks, setDrinks] = useState([]);
  
  const [weight, setWeight] = useState("70");
  const [time, setTime] = useState("1");

  const [selectedPresetKey, setSelectedPresetKey] = useState(""); // Stores index as string
  const [presetQuantity, setPresetQuantity] = useState("1");

  const [numDrinks, setNumDrinks] = useState("1");
  const [glassSize, setGlassSize] = useState("330");
  const [abv, setAbv] = useState("5");

  const [showResults, setShowResults] = useState(false);
  const [bacResults, setBacResults] = useState({
    male: { bacStr: "0.000%", message: "", timeToSober: "N/A", className: "bac-safe" },
    female: { bacStr: "0.000%", message: "", timeToSober: "N/A", className: "bac-safe" },
  });

  const handleStepperUpdate = (currentValStr, setter, change, min, max, stepVal) => {
    let currentValue = parseFloat(currentValStr);
    if (isNaN(currentValue)) { 
      currentValue = (min !== null && min > 0) ? min : 0; 
    }
    
    let newValue = currentValue + change;
    
    if (min !== null) newValue = Math.max(min, newValue);
    if (max !== null) newValue = Math.min(max, newValue);
    
    if (stepVal.toString().includes('.')) { 
      newValue = parseFloat(newValue.toFixed(1)); 
    } else {
      newValue = Math.round(newValue / stepVal) * stepVal;
      if (min !== null) newValue = Math.max(min, newValue); // Re-check min/max after rounding
      if (max !== null) newValue = Math.min(max, newValue);
    }
    setter(newValue.toString());
  };

  const addSelectedPreset = () => {
    if (!selectedPresetKey) {
      alert("Please select a preset drink from the list.");
      return;
    }
    const quantity = parseInt(presetQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity for the preset drink.");
      return;
    }

    const presetData = PRESET_DRINKS_DATA[parseInt(selectedPresetKey)];
    if (!presetData) {
        alert("There was an error adding the preset drink.");
        return;
    }
    
    const totalSize = presetData.size * quantity;
    
    setDrinks(prevDrinks => [...prevDrinks, {
        size: totalSize,
        abv: presetData.abv,
        description: `${quantity} x ${presetData.name} ${presetData.details}`
    }]);
    
    setSelectedPresetKey(""); 
    setPresetQuantity("1"); 
    setShowResults(false);
  };

  const addManualDrink = () => {
    const num = parseInt(numDrinks);
    const size = parseFloat(glassSize);
    const alcoholByVolume = parseFloat(abv);

    if (isNaN(num) || num <= 0 || isNaN(size) || size <= 0 || isNaN(alcoholByVolume) || alcoholByVolume < 0) {
      alert("Please enter valid positive numbers for all manual drink fields (ABV can be 0 or more).");
      return;
    }
    
    const totalVolumeForThisEntry = num * size;
    setDrinks(prevDrinks => [...prevDrinks, { 
        size: totalVolumeForThisEntry, 
        abv: alcoholByVolume, 
        description: `${num} x ${size}ml @ ${alcoholByVolume}% ABV (Manual)` 
    }]);
    
    // Optionally clear manual inputs
    // setNumDrinks("1");
    // setGlassSize("330");
    // setAbv("5");
    setShowResults(false);
  };

  const removeDrink = (indexToRemove) => {
    setDrinks(prevDrinks => prevDrinks.filter((_, index) => index !== indexToRemove));
    setShowResults(false);
  };

  const getBacStatus = (bac) => {
    let className = 'bac-value-display';
    let message = "";
    if (bac === 0) { 
        className += ' bac-safe'; 
        message = "Likely sober. If alcohol was consumed recently, effects might linger.";
    } else if (bac < 0.03) { 
        className += ' bac-safe'; 
        message = "BAC is very low. Caution advised as any alcohol can affect coordination.";
    } else if (bac < 0.08) { 
        className += ' bac-caution'; 
        message = "BAC in caution zone. Impairment is likely. DO NOT DRIVE.";
    } else { 
        className += ' bac-danger'; 
        message = "BAC is high, likely over legal limit. DO NOT DRIVE."; 
    }
    return { className, message };
  };
  
  const getTimeToSober = (bac) => {
    if (bac <= 0) return "0 hr 0 min";
    const hoursToSober = bac / ELIMINATION_RATE; 
    let hours = Math.floor(hoursToSober); 
    let minutes = Math.round((hoursToSober - hours) * 60);
    if (minutes === 60) { hours++; minutes = 0; }
    return `${hours} hr ${minutes} min (approx.)`;
  };

  const calculateBAC = () => {
    const weightKgNum = parseFloat(weight);
    const timeHoursNum = parseFloat(time);

    if (isNaN(weightKgNum) || weightKgNum <= 0) {
      alert("Please enter a valid weight.");
      setShowResults(false);
      return;
    }
    if (drinks.length === 0) {
      alert("Please add at least one drink.");
      setShowResults(false);
      return;
    }

    const weightGrams = weightKgNum * 1000;
    let totalAlcoholGrams = 0;
    drinks.forEach(drink => {
      const alcoholVolumeMl = drink.size * (drink.abv / 100);
      totalAlcoholGrams += alcoholVolumeMl * ALCOHOL_DENSITY;
    });

    const r_male = 0.68;
    const r_female = 0.55;

    let bacMaleCalc = (totalAlcoholGrams / (weightGrams * r_male)) * 100;
    bacMaleCalc -= (ELIMINATION_RATE * timeHoursNum);
    bacMaleCalc = Math.max(0, bacMaleCalc); 

    let bacFemaleCalc = (totalAlcoholGrams / (weightGrams * r_female)) * 100;
    bacFemaleCalc -= (ELIMINATION_RATE * timeHoursNum);
    bacFemaleCalc = Math.max(0, bacFemaleCalc); 

    const maleStatus = getBacStatus(bacMaleCalc);
    const femaleStatus = getBacStatus(bacFemaleCalc);

    setBacResults({
        male: { 
            bacStr: `${bacMaleCalc.toFixed(3)}%`, 
            message: maleStatus.message, 
            timeToSober: getTimeToSober(bacMaleCalc), 
            className: maleStatus.className 
        },
        female: { 
            bacStr: `${bacFemaleCalc.toFixed(3)}%`, 
            message: femaleStatus.message, 
            timeToSober: getTimeToSober(bacFemaleCalc), 
            className: femaleStatus.className 
        },
    });
    setShowResults(true);
  };

  return (
    <div className="app-container">
      <div className="column" id="personalInfoColumn">
        <h2>Your Details</h2>
        <div className="input-group">
          <label htmlFor="weight">Your Weight (kg)</label>
          <div className="stepper">
            <button className="stepper-button" onClick={() => handleStepperUpdate(weight, setWeight, -5, 30, 250, 5)}>-</button>
            <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} min="30" max="250" step="5" />
            <button className="stepper-button" onClick={() => handleStepperUpdate(weight, setWeight, 5, 30, 250, 5)}>+</button>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="time">Time Since First Drink (Hours)</label>
          <div className="stepper">
            <button className="stepper-button" onClick={() => handleStepperUpdate(time, setTime, -0.5, 0, 24, 0.5)}>-</button>
            <input type="number" id="time" value={time} onChange={(e) => setTime(e.target.value)} min="0" max="24" step="0.5" />
            <button className="stepper-button" onClick={() => handleStepperUpdate(time, setTime, 0.5, 0, 24, 0.5)}>+</button>
          </div>
        </div>

        <h3 className="section-title">Quick Add Common Drinks</h3>
        <div className="input-group">
          <label htmlFor="presetDrink">Select:</label>
          <select id="presetDrink" value={selectedPresetKey} onChange={(e) => setSelectedPresetKey(e.target.value)}>
            <option value="">-- Choose a drink --</option>
            {PRESET_DRINKS_DATA.map((drink, index) => (
              <option key={index} value={index.toString()}>
                {drink.name} {drink.details}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="presetQuantity">Quantity:</label>
          <input type="number" id="presetQuantity" value={presetQuantity} onChange={(e) => setPresetQuantity(e.target.value)} min="1" />
        </div>
        <button className="button add-preset-button" onClick={addSelectedPreset}>
          + Add Selected Preset(s)
        </button>
      </div>

      <div className="column" id="drinksColumn">
        <h2>Manage Drinks</h2>
        <h3 className="section-title">Add Drink Manually</h3>
        <div className="manual-drink-inputs-row">
          <div className="input-group">
            <label htmlFor="numDrinks">Number of drinks</label>
            <input type="number" id="numDrinks" value={numDrinks} onChange={(e) => setNumDrinks(e.target.value)} min="1" placeholder="e.g., 1" />
          </div>
          <div className="input-group">
            <label htmlFor="glassSize">Serving Size (ml)</label>
            <input type="number" id="glassSize" value={glassSize} onChange={(e) => setGlassSize(e.target.value)} min="1" placeholder="e.g., 330" />
          </div>
          <div className="input-group">
            <label htmlFor="abv">ABV (%)</label>
            <input type="number" id="abv" value={abv} onChange={(e) => setAbv(e.target.value)} min="0" step="0.1" placeholder="e.g., 5" />
          </div>
        </div>
        <button className="button add-drink-button" onClick={addManualDrink}>
          + Add Manual Drink(s)
        </button>

        <h3 className="section-title">Consumed Drinks</h3>
        <div id="drinkListContainer">
          {drinks.length === 0 ? (
            <p id="noDrinksText">No drinks added yet.</p>
          ) : (
            <ul id="drinkList">
              {drinks.map((drink, index) => (
                <li key={index}>
                  {drink.description}
                  <button className="remove-drink" onClick={() => removeDrink(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="column" id="resultsColumn">
        <h2>Estimated BAC</h2>
        <button className="button calculate-button" onClick={calculateBAC}>
          Calculate BAC
        </button>
        {showResults && (
          <div className="result-section-content" style={{ marginTop: '15px' }}>
            <div className="dual-result-container">
              <div className="dual-result male">
                <h4>For Male Physiology</h4>
                <div id="bacResultDisplayMale" className={bacResults.male.className}>
                  {bacResults.male.bacStr}
                </div>
                <div id="bacMessageMale" className="bac-message-text">{bacResults.male.message}</div>
                <p className="info-text">
                  Est. time to sober: <span id="timeToSoberMale">{bacResults.male.timeToSober}</span>
                </p>
              </div>
              <div className="dual-result female">
                <h4>For Female Physiology</h4>
                <div id="bacResultDisplayFemale" className={bacResults.female.className}>
                  {bacResults.female.bacStr}
                </div>
                <div id="bacMessageFemale" className="bac-message-text">{bacResults.female.message}</div>
                <p className="info-text">
                  Est. time to sober: <span id="timeToSoberFemale">{bacResults.female.timeToSober}</span>
                </p>
              </div>
            </div>
            <p className="info-text legal-limit-info">
              Legal BAC limit in Rwanda for driving: <strong>0.08%</strong>.
              <br />Any alcohol can impair driving.
            </p>
          </div>
        )}
        <div className="results-column-footer">
          <div className="footer-disclaimer">
            <p>
              <strong>Disclaimer:</strong> This is an estimate for informational
              purposes. Individual results vary. Factors like food, metabolism,
              health, & medication affect BAC.
              <strong>DO NOT use this to determine fitness to drive.</strong>
              Safe driving BAC is 0.00%. Never drink & drive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;