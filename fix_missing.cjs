const fs = require('fs');
let r = fs.readFileSync('src/data/nodeMaster.js', 'utf8');
const idsToUpdate = ['BR01','BR02','BR03','BR04','BR05','J11','J12','J13','J14','J15'];
idsToUpdate.forEach(id => {
  const r2 = new RegExp(`({"id":"${id}"[^}]*"y":)\\s*(\\d+)(,\\s*"x":\\s*)(\\d+)(\\s*})`, 'g');
  r = r.replace(r2, (match, p1, y, p3, x, p5) => {
    return p1 + (1024 - parseInt(y)) + p3 + (1536 - parseInt(x)) + p5;
  });
});
fs.writeFileSync('src/data/nodeMaster.js', r);
console.log('Fixed missing nodes');
