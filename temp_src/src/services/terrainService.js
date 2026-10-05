import { nodeMaster } from '../data/nodeMaster.js';

// Deterministic Terrain Service
// Returns FIXED terrain values based on node elevation bands.
// NO Math.random(). Same node → same terrain → same risk → always.

export const terrainService = {
  getTerrainForNode: (nodeId) => {
    const node = nodeMaster.find(n => n.id === nodeId);
    if (!node) return null;

    const elevation = node.elevation;

    if (elevation > 5500) {
      return {
        elevation: node.elevation,
        terrainType: 'Glacier',
        landslideRisk: 'High',
        avalancheRisk: 'Very High',
        waterCrossing: false
      };
    } else if (elevation > 4500) {
      return {
        elevation: node.elevation,
        terrainType: 'Snow',
        landslideRisk: 'Medium',
        avalancheRisk: 'High',
        waterCrossing: false
      };
    } else if (elevation > 3500) {
      return {
        elevation: node.elevation,
        terrainType: 'Rocky Mountain',
        landslideRisk: 'Medium',
        avalancheRisk: 'Medium',
        waterCrossing: true
      };
    } else if (elevation > 3000) {
      return {
        elevation: node.elevation,
        terrainType: 'Mountain',
        landslideRisk: 'Low',
        avalancheRisk: 'Low',
        waterCrossing: true
      };
    } else {
      return {
        elevation: node.elevation,
        terrainType: 'Valley',
        landslideRisk: 'No',
        avalancheRisk: 'No',
        waterCrossing: true
      };
    }
  }
};
