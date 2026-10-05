const fs = require('fs');

const nodeMasterPath = './src/data/nodeMaster.js';
const roadGeometryPath = './src/data/roadGeometry.js';

// 1. Update nodeMaster.js
let nodeContent = fs.readFileSync(nodeMasterPath, 'utf8');
nodeContent = nodeContent.replace(/"y":\s*(\d+)/g, (match, y) => {
  return `"y":${1024 - parseInt(y)}`;
});
fs.writeFileSync(nodeMasterPath, nodeContent);

// 2. Update roadGeometry.js
let roadContent = fs.readFileSync(roadGeometryPath, 'utf8');
roadContent = roadContent.replace(/\[(\d+),\s*(\d+)\]/g, (match, y, x) => {
  return `[${1024 - parseInt(y)}, ${x}]`;
});
fs.writeFileSync(roadGeometryPath, roadContent);

console.log('Coordinates inverted successfully.');
