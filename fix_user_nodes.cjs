const fs = require('fs');

let nodeContent = fs.readFileSync('src/data/nodeMaster.js', 'utf8');

const updates = {
  // Corrected visual coordinates based on map.png
  'CP03': { x: 461, y: 718, name: 'Hunder Junction' }, // from OCR + map
  'L11': { x: 420, y: 80, name: 'Weather Station' }, // top left
  'L15': { x: 749, y: 238 }, // from OCR
  'L16': { x: 948, y: 301 }, // from OCR
  'L18': { x: 529, y: 76 }, // from OCR
  'L19': { x: 934, y: 88 }, // from OCR
  'CP12': { x: 769, y: 76 }, // from OCR
  'L01': { x: 541, y: 900 },
  'L04': { x: 1220, y: 840 },
  'CP09': { x: 410, y: 250 }, // Khardung Junction (near L11)
  'CP08': { x: 370, y: 360 }, // North Phullu Junction
};

for (const [id, data] of Object.entries(updates)) {
  const regex = new RegExp(`({"id":"${id}",[^}]*"y":\\s*)\\d+(,\\s*"x":\\s*)\\d+(\\s*})`, 'g');
  if (nodeContent.match(regex)) {
    nodeContent = nodeContent.replace(regex, `$1${data.y}$2${data.x}$3`);
    console.log(`Updated ${id} coords to x:${data.x} y:${data.y}`);
  }
  
  if (data.name) {
    const nameRegex = new RegExp(`({"id":"${id}","name":")[^"]+(",)`);
    if (nodeContent.match(nameRegex)) {
      nodeContent = nodeContent.replace(nameRegex, `$1${data.name}$2`);
      console.log(`Updated ${id} name to ${data.name}`);
    }
  }
}

fs.writeFileSync('src/data/nodeMaster.js', nodeContent);
console.log('Done fixing nodeMaster.js');
