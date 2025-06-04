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
    <div className={`dual-result ${title.toLowerCase().includes('male') ? 'male' : 'female'}`}>
      <h4>{title}</h4>
      <div id={`bacResultDisplay${title.includes('Male') ? 'Male' : 'Female'}`} className={resultData.className}>
        {resultData.bacStr}
      </div>
      <div id={`bacMessage${title.includes('Male') ? 'Male' : 'Female'}`} className="bac-message-text">
        {resultData.message}
      </div>
      <p className="info-text">
        Est. time to sober: <span id={`timeToSober${title.includes('Male') ? 'Male' : 'Female'}`}>{resultData.timeToSober}</span>
      </p>
    </div>
  );
}

export default BacResultCard;