const Tesseract = require('tesseract.js');
const fs = require('fs');

async function extractNodeCoords() {
  console.log("Starting OCR on public/map.png...");
  const worker = await Tesseract.createWorker('eng');
  
  const result = await worker.recognize('public/map.png');
  // tesseract.js v5 format
  const words = result.data.words;
  
  const results = [];
  const nodeRegex = /\b([LCHRBJ][P|T|R]?\d{2})\b/g;

  if (words) {
    words.forEach(word => {
      const text = word.text;
      const match = text.match(nodeRegex);
      if (match) {
        const id = match[0];
        const bbox = word.bbox;
        const cx = Math.round((bbox.x0 + bbox.x1) / 2);
        const cy = Math.round((bbox.y0 + bbox.y1) / 2);
        
        results.push({ id, text, x: cx, y: cy, bbox });
      }
    });
  }

  await worker.terminate();

  fs.writeFileSync('ocr_nodes.json', JSON.stringify(results, null, 2));
  console.log(`Found ${results.length} potential nodes.`);
}

extractNodeCoords().catch(err => console.error(err));
