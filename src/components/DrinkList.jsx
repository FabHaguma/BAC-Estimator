// src/components/DrinkList.jsx
import React from 'react';

function DrinkList({ drinks, onRemoveDrink }) {
  if (drinks.length === 0) {
    return <p id="noDrinksText">No drinks added yet.</p>;
  }

  return (
    <ul id="drinkList">
      {drinks.map((drink, index) => (
        <li key={index}>
          {drink.description}
          <button
            type="button"
            className="remove-drink"
            onClick={() => onRemoveDrink(index)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DrinkList;