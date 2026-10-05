

const xlsx = require('xlsx');



const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'DATASET');
const OUT_DIR = path.join(__dirname);

function parseSheet(fileName, sheetName = null) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    return [];
  }
  const workbook = xlsx.readFile(filePath);
  const targetSheet = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[targetSheet];
  return xlsx.utils.sheet_to_json(sheet);
}

function saveFile(filename, varName, data) {
  const content = `export const ${varName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(OUT_DIR, filename), content);
  console.log(`Saved ${filename} (${data.length} records)`);
}

// 1. Geographic Master
const geo = parseSheet('Geographic Master V1 (1).xlsx').filter(row => row.ID && /^(L|CP|RP|HP|B|OT)\d+$/.test(row.ID));
saveFile('geographicMaster.js', 'geographicMaster', geo);

// 2. Checkpoint Master
const cp = parseSheet('Checkpoint Master (1).xlsx').filter(row => row['Checkpoint ID']);
saveFile('checkpointMaster.js', 'checkpointMaster', cp);

// 4. Helipad Master
const hp = parseSheet('Helipad Master (1).xlsx').filter(row => row['Helipad ID']);
saveFile('helipadMaster.js', 'helipadMaster', hp);

// 5. Air Route Master
const air = parseSheet('Air route master (1).xlsx').filter(row => row['Air Route ID']);
saveFile('airRouteMaster.js', 'airRouteMaster', air);

// 6. Rest Point Master
const rp = parseSheet('Rest Point master (1).xlsx').filter(row => row['Rest Point ID']);
saveFile('restPointMaster.js', 'restPointMaster', rp);

// 7. Observation Tower Master
const ot = parseSheet('Observation tower master (1).xlsx').filter(row => row['Tower ID']);
saveFile('observationTowerMaster.js', 'observationTowerMaster', ot);

// 8. Terrain Master
const terrain = parseSheet('Terrain master (1).xlsx').filter(row => row['Road ID']);
saveFile('terrainMaster.js', 'terrainMaster', terrain);

// 9. Weather Master
const weather = parseSheet('Weather master (1).xlsx').filter(row => row['Road ID']);
saveFile('weatherMaster.js', 'weatherMaster', weather);

// 10. Operational Status
const opsStatus = parseSheet('Road_Operational_Status_Dataset (1).xlsx').filter(row => row['Road ID']);

// Construct roadMaster dynamically merging the necessary fields to keep UI working
const rawRoads = parseSheet('Road Master (1).xlsx').filter(row => row['Road ID']);

const roadMasterCompiled = rawRoads.map(r => {
  const t = terrain.find(x => x['Road ID'] === r['Road ID']) || {};
  const w = weather.find(x => x['Road ID'] === r['Road ID']) || {};
  const o = opsStatus.find(x => x['Road ID'] === r['Road ID']) || {};

  return {
    id: r['Road ID'],
    from: (r['From Node'] || '').replace(/^JN(\d)$/, 'J0$1').replace(/^JN(\d{2})$/, 'J$1'),
    to: (r['To Node'] || '').replace(/^JN(\d)$/, 'J0$1').replace(/^JN(\d{2})$/, 'J$1'),
    distanceKm: r['Distance (km)'],
    surfaceType: r['Surface Type'],
    terrainType: t['Terrain Type'] || r['Terrain'] || 'Unknown',
    operationalStatus: o['Status'] || 'Open',
    condition: t['Road Condition'] || 'Good',
    weatherCondition: w['Weather Condition'] || 'Clear',
    visibility: w['Visibility'] || 'Good',
    twoWay: r['Two Way'] === 'Yes',
    baseSpeed: r['Avg. Speed (km/h)'],
    // raw data for advanced logic
    _raw: {
      road: r, terrain: t, weather: w, status: o
    }
  };
});

let roadMasterString = `export const roadMaster = ${JSON.stringify(roadMasterCompiled, null, 2)};\n`;

roadMasterString += `
export const getAdjacencyList = () => {
  const adj = {};
  roadMaster.forEach(road => {
    if (!adj[road.from]) adj[road.from] = [];
    if (!adj[road.to]) adj[road.to] = [];
    
    const edgeData = {
      node: road.to,
      roadId: road.id,
      distance: road.distanceKm,
      type: road.terrainType, // mapping terrainType to type
      surfaceType: road.surfaceType,
      condition: road.condition,
      status: road.operationalStatus,
      twoWay: road.twoWay,
      _raw: road._raw
    };

    adj[road.from].push({ ...edgeData, node: road.to });
    if (road.twoWay) {
      adj[road.to].push({ ...edgeData, node: road.from });
    }
  });
  return adj;
};
`;

fs.writeFileSync(path.join(OUT_DIR, 'roadMaster.js'), roadMasterString);
console.log(`Saved roadMaster.js (${roadMasterCompiled.length} records)`);

console.log('All 9 frozen datasets generated, roadMaster compiled for UI.');
