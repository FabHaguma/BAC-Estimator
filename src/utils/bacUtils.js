// src/bacUtils.js

export const ALCOHOL_DENSITY = 0.789; // g/ml
export const ELIMINATION_RATE = 0.015; // % per hour
const R_MALE = 0.68;
const R_FEMALE = 0.55;

/**
 * Calculates the total grams of alcohol consumed.
 * @param {Array} drinks - Array of drink objects ({ size, abv }).
 * @returns {number} Total grams of alcohol.
 */
export function calculateTotalAlcoholGrams(drinks) {
  let totalAlcoholGrams = 0;
  drinks.forEach(drink => {
    const alcoholVolumeMl = drink.size * (drink.abv / 100);
    totalAlcoholGrams += alcoholVolumeMl * ALCOHOL_DENSITY;
  });
  return totalAlcoholGrams;
}

/**
 * Calculates the Blood Alcohol Content (BAC) for a specific gender.
 * @param {number} totalAlcoholGrams - Total grams of alcohol consumed.
 * @param {number} weightGrams - Body weight in grams.
 * @param {number} timeHours - Time since first drink in hours.
 * @param {string} gender - 'male' or 'female'.
 * @returns {number} Calculated BAC, non-negative.
 */
export function calculateBacForGender(totalAlcoholGrams, weightGrams, timeHours, gender) {
  const genderConstant = gender === 'male' ? R_MALE : R_FEMALE;
  if (weightGrams <= 0 || genderConstant <= 0) return 0;

  let bac = (totalAlcoholGrams / (weightGrams * genderConstant)) * 100;
  bac -= (ELIMINATION_RATE * timeHours);
  return Math.max(0, bac);
}

/**
 * Determines the BAC message and CSS class based on the BAC value.
 * @param {number} bac - The BAC value.
 * @returns {object} - Object with { className, message }.
 */
export function getBacStatus(bac) {
  let className = 'bac-value-display';
  let message = "";

  if (bac === 0) {
    className += ' bac-safe';
    message = "Likely sober. No alcohol detected.";
  } else if (bac < 0.03) {
    className += ' bac-safe';
    message = "BAC is low. Any alcohol can affect coordination.";
  } else if (bac < 0.05) {
    className += ' bac-caution';
    message = "BAC is rising. Impairment is likely possible.";
  } else if (bac < 0.08) {
    className += ' bac-danger';
    message = "BAC in caution zone. Noticeable impairment. DO NOT DRIVE.";
  } else {
    className += ' bac-danger';
    message = "BAC is high, over legal limit. DO NOT DRIVE.";
  }
  return { className, message };
}

/**
 * Formats the time to sober into a string.
 * @param {number} bac - The BAC value.
 * @returns {string} - Formatted time string (e.g., "2 hr 30 min (approx.)").
 */
export function formatTimeToSober(bac) {
  if (bac <= 0) return "0 hr 0 min";

  const hoursToSober = bac / ELIMINATION_RATE;
  let hours = Math.floor(hoursToSober);
  let minutes = Math.round((hoursToSober - hours) * 60);

  if (minutes === 60) {
    hours++;
    minutes = 0;
  }
  return `${hours} hr ${minutes} min (approx.)`;
}

