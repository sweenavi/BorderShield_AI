import { weatherMaster } from '../data/weatherMaster.js';

export const weatherService = {
  getWeatherForRoad: (roadId) => {
    const record = weatherMaster.find(w => w['Road ID'] === roadId);
    if (!record) {
      console.error(`WEATHER SERVICE: Missing weather record for road ${roadId}`);
      return null;
    }
    return record;
  },
  getWeatherForNode: (nodeId) => {
    const record = weatherMaster.find(w => w['From Node'] === nodeId || w['To Node'] === nodeId);
    if (!record) {
      // Return a safe fallback if a node has no associated road in the master data (e.g. isolated or synthetic node)
      return {
        "Temperature (°C)": 15,
        "Weather Condition": "Clear",
        "Visibility": "Good",
        "Wind Speed (km/h)": 10,
        "Rainfall": "No",
        "Snowfall": "No",
        "Road Status": "Open",
        "Risk Level": "Low"
      };
    }
    return record;
  }
};
