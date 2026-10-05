const fs = require('fs');

const nodeMasterPath = './src/data/nodeMaster.js';
const roadGeometryPath = './src/data/roadGeometry.js';

// 1. Update nodeMaster.js X coordinates
let nodeContent = fs.readFileSync(nodeMasterPath, 'utf8');
nodeContent = nodeContent.replace(/"x":\s*(\d+)/g, (match, x) => {
  return `"x":${1536 - parseInt(x)}`;
});
fs.writeFileSync(nodeMasterPath, nodeContent);

// 2. Update roadGeometry.js X coordinates
let roadContent = fs.readFileSync(roadGeometryPath, 'utf8');
roadContent = roadContent.replace(/\[(\d+),\s*(\d+)\]/g, (match, y, x) => {
  return `[${y}, ${1536 - parseInt(x)}]`;
});
fs.writeFileSync(roadGeometryPath, roadContent);

console.log('X Coordinates inverted successfully.');
