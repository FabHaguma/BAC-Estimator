// src/components/StepperInput.jsx
import React from 'react';

function StepperInput({ label, id, value, onChange, onStep, min, max, step, stepAmount }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          type="button" // Good practice for buttons not submitting forms
          className="stepper-button"
          onClick={() => onStep(-stepAmount)} // Use stepAmount for consistency
        >
          -
        </button>
        <input
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        <button
          type="button"
          className="stepper-button"
          onClick={() => onStep(stepAmount)} // Use stepAmount
        >
          +
        </button>
      </div>
    </div>
  );
}

export default StepperInput;