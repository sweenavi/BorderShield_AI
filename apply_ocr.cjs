const fs = require('fs');

const ocrFile = 'ocr_nodes.json';
const nodeMasterFile = './src/data/nodeMaster.js';

if (!fs.existsSync(ocrFile)) {
  console.log('No OCR file found.');
  process.exit(1);
}

const ocrData = JSON.parse(fs.readFileSync(ocrFile, 'utf8'));
let nodeContent = fs.readFileSync(nodeMasterFile, 'utf8');

// For each node found in OCR, replace its coordinates in nodeMaster.js
let updatedCount = 0;
ocrData.forEach(item => {
  // Try to find it in the file
  const regex = new RegExp(`({"id":"${item.id}",[^}]*"y":\\s*)\\d+(,\\s*"x":\\s*)\\d+(\\s*})`, 'g');
  
  if (nodeContent.match(regex)) {
    // Offset slightly assuming symbol is 15px to the left of the text center
    const symbolX = item.x - 15;
    const symbolY = item.y;
    nodeContent = nodeContent.replace(regex, `$1${symbolY}$2${symbolX}$3`);
    updatedCount++;
    console.log(`Updated ${item.id} to x:${symbolX}, y:${symbolY}`);
  }
});

fs.writeFileSync(nodeMasterFile, nodeContent);
console.log(`Successfully updated ${updatedCount} nodes from OCR.`);
