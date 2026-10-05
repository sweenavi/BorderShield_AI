import fs from 'fs';
import { nodeMaster } from './src/data/nodeMaster.js';

// Image dims
const MAX_Y = 1024;
const MAX_X = 1536;

// Find min/max lat/lng in current data
let minLat = Infinity, maxLat = -Infinity;
let minLng = Infinity, maxLng = -Infinity;

nodeMaster.forEach(n => {
  if (n.lat < minLat) minLat = n.lat;
  if (n.lat > maxLat) maxLat = n.lat;
  if (n.lng < minLng) minLng = n.lng;
  if (n.lng > maxLng) maxLng = n.lng;
});

// Add some padding
minLat -= 0.05;
maxLat += 0.05;
minLng -= 0.05;
maxLng += 0.05;

let newNodes = nodeMaster.map(n => {
  // Map lat to Y (0 to 1024)
  const y = Math.round(((n.lat - minLat) / (maxLat - minLat)) * MAX_Y);
  // Map lng to X (0 to 1536)
  const x = Math.round(((n.lng - minLng) / (maxLng - minLng)) * MAX_X);
  
  return { ...n, y, x };
});

// Generate new file content
let content = `export const NODE_TYPES = {
  LOCATION: 'L',
  CHECKPOINT: 'CP',
  REST_POINT: 'RP',
  HELIPAD: 'HP',
  JUNCTION: 'J'
};

export const nodeMaster = [\n`;

newNodes.forEach(n => {
  content += `  { id: '${n.id}', name: '${n.name}', type: '${n.type}', elevation: ${n.elevation}, y: ${n.y}, x: ${n.x} },\n`;
});

content += `];\n`;

fs.writeFileSync('transformed_nodes.js', content);
console.log("Transformed nodes saved to transformed_nodes.js");
