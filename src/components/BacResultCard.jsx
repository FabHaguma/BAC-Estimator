// src/components/BacResultCard.jsx
import React from 'react';

function BacResultCard({ title, resultData }) {
  // resultData is expected to be an object like:
  // { bacStr, message, timeToSober, className }
  
  if (!resultData) {
    // Handle cases where resultData might be initially undefined or null if needed
    return null; 
  }

  return (
    <div className={`dual-result ${title.toLowerCase().startsWith('for female') ? 'female' : 'male'}`}>
      <h4>{title}</h4>
      <div id={`bacResultDisplay${title.includes('Female') ? 'Female' : 'Male'}`} className={resultData.className}>
        {resultData.bacStr}
      </div>
      <div id={`bacMessage${title.includes('Female') ? 'Female' : 'Male'}`} className="bac-message-text">
        {resultData.message}
      </div>
      <p className="info-text">
        Est. time to sober: <span id={`timeToSober${title.includes('Female') ? 'Female' : 'Male'}`}>{resultData.timeToSober}</span>
      </p>
    </div>
  );
}

export default BacResultCard;