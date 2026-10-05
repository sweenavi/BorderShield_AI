const xlsx = require('xlsx');
const fs = require('fs');

const extract = (filePath, sheetIndex = 0) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

console.log('Geographic Master content:');
console.log(extract('./DATASET/Geographic Master V1 (1).xlsx'));
