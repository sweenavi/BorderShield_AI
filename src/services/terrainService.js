import { terrainMaster } from '../data/terrainMaster.js';

export const terrainService = {
  getTerrainForRoad: (roadId) => {
    const record = terrainMaster.find(t => t['Road ID'] === roadId);
    if (!record) {
      console.error(`TERRAIN SERVICE: Missing terrain record for road ${roadId}`);
      return null;
    }
    return record;
  },
  getTerrainForNode: (nodeId) => {
    const record = terrainMaster.find(t => t['From Node'] === nodeId || t['To Node'] === nodeId);
    if (!record) {
      return {
        "Terrain Type": "Plain",
        "Avg Elevation (m)": 3000,
        "Difficulty Level": "Low",
        "Road Condition": "Good",
        "Landslide Risk": "No"
      };
    }
    return record;
  }
};
