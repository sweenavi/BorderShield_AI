import fs from 'fs';
import { nodeMaster } from './src/data/nodeMaster.js';

const coords = {};
nodeMaster.forEach(n => {
  coords[n.id] = { x: Math.round(n.x || 0), y: Math.round(n.y || 0) };
});

const fileContent = `export const mapNodeCoordinates = ${JSON.stringify(coords, null, 2)};\n`;
fs.writeFileSync('./src/data/mapNodeCoordinates.js', fileContent);
console.log('Created mapNodeCoordinates.js');
