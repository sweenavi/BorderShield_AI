import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetDir = path.join(__dirname, 'DATASET');

// Helper to read first sheet
function readSheet(filename) {
  const filePath = path.join(datasetDir, filename);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// 1. Read all Node data
const geoData = readSheet('Geographic Master V1 (1).xlsx');
const cpData = readSheet('Checkpoint Master (1).xlsx');
const hpData = readSheet('Helipad Master (1).xlsx');
const otData = readSheet('Observation tower master (1).xlsx');
const rpData = readSheet('Rest Point master (1).xlsx');

// 2. Read existing nodeMaster to preserve x, y
const nodeMasterContent = fs.readFileSync('./src/data/nodeMaster.js', 'utf8');
// Very basic parse, we will output a new JS file
let existingNodes = [];
try {
  // Hack to extract the array
  const arrayStr = nodeMasterContent.match(/export const nodeMaster = (\[[\s\S]*?\]);/)[1];
  existingNodes = eval(arrayStr);
} catch (e) {
  console.error("Failed to parse existing nodeMaster.js", e);
}

// Map of existing x,y
const xyMap = {};
existingNodes.forEach(n => {
  xyMap[n.id] = { x: n.x, y: n.y };
});

const newNodes = [];

// Process L nodes
geoData.forEach(row => {
  newNodes.push({
    id: row.ID,
    name: row['Operational Name'],
    type: 'L',
    elevation: row['Elevation (m)'],
    lat: row['Derived Latitude'] || row['Original Latitude'],
    lng: row['Derived Longitude'] || row['Original Longitude'],
    y: xyMap[row.ID]?.y || 0,
    x: xyMap[row.ID]?.x || 0
  });
});

// Process CP nodes
cpData.forEach(row => {
  newNodes.push({
    id: row['Checkpoint ID'],
    name: row['Checkpoint Name'],
    type: 'CP',
    elevation: row['Elevation (m)'],
    lat: row['Latitude'],
    lng: row['Longitude'],
    y: xyMap[row['Checkpoint ID']]?.y || 0,
    x: xyMap[row['Checkpoint ID']]?.x || 0
  });
});

// Process RP nodes
rpData.forEach(row => {
  newNodes.push({
    id: row['Rest Point ID'],
    name: row['Rest Point Name'],
    type: 'RP',
    elevation: row['Elevation (m)'],
    lat: row['Latitude'],
    lng: row['Longitude'],
    y: xyMap[row['Rest Point ID']]?.y || 0,
    x: xyMap[row['Rest Point ID']]?.x || 0
  });
});

// Process HP nodes
hpData.forEach(row => {
  newNodes.push({
    id: row['Helipad ID'],
    name: row['Helipad Name'],
    type: 'HP',
    elevation: row['Elevation (m)'],
    lat: row['Latitude'],
    lng: row['Longitude'],
    y: xyMap[row['Helipad ID']]?.y || 0,
    x: xyMap[row['Helipad ID']]?.x || 0
  });
});

// Process OT nodes
otData.forEach(row => {
  newNodes.push({
    id: row['Tower ID'],
    name: row['Tower Name'],
    type: 'OT',
    elevation: row['Elevation (m)'],
    lat: row['Latitude'],
    lng: row['Longitude'],
    y: xyMap[row['Tower ID']]?.y || 0,
    x: xyMap[row['Tower ID']]?.x || 0
  });
});

// Preserve internal Junctions and Bridges from existing
existingNodes.forEach(n => {
  if (['J', 'BR'].includes(n.type)) {
    if (!newNodes.find(x => x.id === n.id)) {
      newNodes.push(n);
    }
  }
});

// 3. Output new nodeMaster.js
let newNodeMasterOut = `// AUTO-GENERATED FROM EXACT DATASET VALUES
export const NODE_TYPES = {
  L: { color: 'var(--status-info)', label: 'Operational Location' },
  CP: { color: 'var(--status-warning)', label: 'Checkpoint' },
  RP: { color: 'var(--status-success)', label: 'Rest Point' },
  HP: { color: 'var(--status-success)', label: 'Helipad' },
  BR: { color: 'var(--status-info)', label: 'Bridge' },
  OT: { color: '#8a2be2', label: 'Observation Tower' }, // Purple
  J:  { color: 'var(--status-danger)', label: 'Junction' }
};

export const nodeMaster = [\n`;

newNodes.forEach(n => {
  newNodeMasterOut += `  ${JSON.stringify(n)},\n`;
});
newNodeMasterOut += `];\n`;

fs.writeFileSync('./src/data/nodeMaster.js', newNodeMasterOut);
console.log('Successfully updated nodeMaster.js');

// 4. Read Road data
const roadData = readSheet('Road Master (1).xlsx');
const terrainData = readSheet('Terrain master (1).xlsx');
const weatherData = readSheet('Weather master (1).xlsx');
const statusData = readSheet('Road_Operational_Status_Dataset (1).xlsx');

const newRoads = [];

roadData.forEach(r => {
  const roadId = r['Road ID'];
  
  // Find matching terrain, weather, status
  const t = terrainData.find(x => x['Road ID'] === roadId) || {};
  const w = weatherData.find(x => x['Road ID'] === roadId) || {};
  const s = statusData.find(x => x['Road ID'] === roadId) || {};

  let fromNode = r['From Node'];
  let toNode = r['To Node'];
  
  if (fromNode && fromNode.startsWith('JN')) {
    const num = fromNode.replace('JN', '');
    fromNode = 'J' + num.padStart(2, '0');
  }
  if (toNode && toNode.startsWith('JN')) {
    const num = toNode.replace('JN', '');
    toNode = 'J' + num.padStart(2, '0');
  }

  newRoads.push({
    id: roadId,
    from: fromNode,
    to: toNode,
    distanceKm: r['Distance (km)'],
    surfaceType: r['Surface Type'] || t['Road Condition'] || 'Asphalt',
    terrainType: t['Terrain Type'] || 'Valley',
    operationalStatus: s['Status'] || 'Open',
    condition: t['Road Condition'] || 'Good',
    weatherCondition: w['Weather Condition'] || 'Clear',
    visibility: w['Visibility'] || 'Excellent',
    twoWay: r['Two Way'] === 'Yes'
  });
});

// Output new roadMaster.js
let newRoadMasterOut = `// AUTO-GENERATED FROM EXACT DATASET VALUES
export const roadMaster = [\n`;
newRoads.forEach(r => {
  newRoadMasterOut += `  ${JSON.stringify(r)},\n`;
});
newRoadMasterOut += `];

export const getAdjacencyList = () => {
  const adj = {};
  roadMaster.forEach(road => {
    if (!adj[road.from]) adj[road.from] = [];
    if (!adj[road.to]) adj[road.to] = [];
    
    adj[road.from].push({ to: road.to, roadId: road.id, distance: road.distanceKm, twoWay: road.twoWay });
    if (road.twoWay) {
      adj[road.to].push({ to: road.from, roadId: road.id, distance: road.distanceKm, twoWay: road.twoWay });
    }
  });
  return adj;
};
`;

fs.writeFileSync('./src/data/roadMaster.js', newRoadMasterOut);
console.log('Successfully updated roadMaster.js');
