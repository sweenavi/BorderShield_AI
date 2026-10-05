import { nodeMaster } from '../data/nodeMaster.js';

// Deterministic Weather Service
// Returns FIXED weather values based on node elevation bands.
// NO Math.random(). Same node → same weather → same risk → always.

export const weatherService = {
  getWeatherForNode: (nodeId) => {
    const node = nodeMaster.find(n => n.id === nodeId);
    if (!node) {
      console.log('WEATHER SERVICE MISSING NODE:', nodeId);
      return null;
    }

    const elevation = node.elevation;

    // Deterministic values per elevation band
    // These are frozen mock values representing typical conditions at each altitude.
    if (elevation > 6000) {
      return {
        temperature: -28,    // °C
        snowfall: 50,        // mm
        visibility: 150,     // meters
        windSpeed: 75,       // km/h
        rainfall: 0,         // mm
        condition: 'Severe Blizzard'
      };
    } else if (elevation > 5000) {
      return {
        temperature: -15,
        snowfall: 25,
        visibility: 400,
        windSpeed: 55,
        rainfall: 0,
        condition: 'Heavy Snow'
      };
    } else if (elevation > 4500) {
      return {
        temperature: -10,
        snowfall: 15,
        visibility: 600,
        windSpeed: 45,
        rainfall: 0,
        condition: 'Snow Showers'
      };
    } else if (elevation > 3500) {
      return {
        temperature: 0,
        snowfall: 3,
        visibility: 3000,
        windSpeed: 28,
        rainfall: 2,
        condition: 'Overcast'
      };
    } else if (elevation > 3000) {
      return {
        temperature: 5,
        snowfall: 0,
        visibility: 5000,
        windSpeed: 18,
        rainfall: 3,
        condition: 'Partly Cloudy'
      };
    } else {
      return {
        temperature: 8,
        snowfall: 0,
        visibility: 8000,
        windSpeed: 12,
        rainfall: 0,
        condition: 'Clear'
      };
    }
  }
};
