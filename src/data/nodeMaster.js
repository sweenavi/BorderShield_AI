import { geographicMaster } from './geographicMaster.js';
import { checkpointMaster } from './checkpointMaster.js';
import { helipadMaster } from './helipadMaster.js';
import { restPointMaster } from './restPointMaster.js';
import { observationTowerMaster } from './observationTowerMaster.js';
import { roadMaster } from './roadMaster.js';
import { mapNodeCoordinates } from './mapNodeCoordinates.js';

export const NODE_TYPES = {
  L:  { color: 'var(--status-info)',    label: 'Operational Location' },
  CP: { color: 'var(--status-warning)', label: 'Checkpoint' },
  RP: { color: 'var(--accent-cyan)',    label: 'Rest Point' },
  HP: { color: 'var(--status-success)', label: 'Helipad' },
  BR: { color: 'var(--accent-blue)',    label: 'Bridge' },
  OT: { color: '#A855F7',              label: 'Observation Tower' },
  J:  { color: 'var(--road-inactive)', label: 'Junction' }
};

const baseNodes = [];

// Helper to determine type
const getType = (id) => {
  if (id.startsWith('L')) return 'L';
  if (id.startsWith('CP')) return 'CP';
  if (id.startsWith('RP')) return 'RP';
  if (id.startsWith('HP')) return 'HP';
  if (id.startsWith('BR')) return 'BR';
  if (id.startsWith('OT')) return 'OT';
  if (id.startsWith('JN') || id.startsWith('J')) return 'J';
  return 'L';
};

// 1. Locations
geographicMaster.forEach(row => {
  baseNodes.push({
    id: row.ID,
    name: row['Operational Name'],
    type: 'L',
    elevation: row['Elevation (m)'],
    lat: row['Derived Latitude'] || row['Original Latitude'],
    lng: row['Derived Longitude'] || row['Original Longitude']
  });
});

// 2. Checkpoints
checkpointMaster.forEach(row => {
  baseNodes.push({
    id: row['Checkpoint ID'] || row['CP ID'] || row.ID,
    name: row['Checkpoint Name'] || row['Name'],
    type: 'CP',
    elevation: row['Elevation (m)']
  });
});

// 3. Helipads
helipadMaster.forEach(row => {
  baseNodes.push({
    id: row['Helipad ID'] || row.ID,
    name: row['Helipad Name'] || row['Name'],
    type: 'HP',
    elevation: row['Elevation (m)']
  });
});

// 4. Rest Points
restPointMaster.forEach(row => {
  baseNodes.push({
    id: row['Rest Point ID'] || row.ID,
    name: row['Rest Point Name'] || row['Name'],
    type: 'RP',
    elevation: row['Elevation (m)']
  });
});

// 5. Observation Towers
observationTowerMaster.forEach(row => {
  baseNodes.push({
    id: row['Tower ID'] || row.ID,
    name: row['Tower Name'] || row['Name'],
    type: 'OT',
    elevation: row['Elevation (m)']
  });
});

// 6. Bridges and Junctions (derived from roadMaster)
const existingIds = new Set(baseNodes.map(n => n.id));
roadMaster.forEach(road => {
  const nodes = [road.from, road.to];
  nodes.forEach(nodeId => {
    if (!nodeId) return;
    const normalizedId = nodeId.replace(/^JN/, 'J');
    
    if (!existingIds.has(normalizedId)) {
      const type = getType(normalizedId);
      if (type === 'BR' || type === 'J') {
        baseNodes.push({
          id: normalizedId,
          name: type === 'BR' ? 'Bridge ' + normalizedId.replace('BR','') : 'Junction ' + normalizedId.replace('J',''),
          type: type,
          elevation: 3500 // Fallback elevation since they aren't in a master
        });
        existingIds.add(normalizedId);
      }
    }
  });
});

// Join with coordinates
export const nodeMaster = baseNodes.map(n => {
  const c = mapNodeCoordinates[n.id];
  return { ...n, x: c ? c.x : 0, y: c ? c.y : 0 };
});
