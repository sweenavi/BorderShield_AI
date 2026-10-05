import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetDir = path.join(__dirname, 'DATASET');
const files = fs.readdirSync(datasetDir).filter(f => f.endsWith('.xlsx'));

const summary = {};

for (const file of files) {
  const filePath = path.join(datasetDir, file);
  try {
    const workbook = xlsx.readFile(filePath);
    summary[file] = {};
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      // Just grab first 3 rows to understand structure
      summary[file][sheetName] = data.slice(0, 3);
    }
  } catch(e) {
    console.error(`Error reading ${file}:`, e);
  }
}

fs.writeFileSync(path.join(__dirname, 'dataset_summary.json'), JSON.stringify(summary, null, 2));
console.log('Summary written to dataset_summary.json');
