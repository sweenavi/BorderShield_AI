const fs = require('fs');
const tNodes = fs.readFileSync('transformed_nodes.js', 'utf8');
const nNodes = fs.readFileSync('src/data/nodeMaster.js', 'utf8');

const tNodesObj = {};
const regex = /\{\s*id:\s*'([^']+)'[^}]*y:\s*(\d+)[^}]*x:\s*(\d+)/g;
let match;
while ((match = regex.exec(tNodes)) !== null) {
  tNodesObj[match[1]] = { y: parseInt(match[2]), x: parseInt(match[3]) };
}

let updatedNodes = nNodes;
Object.keys(tNodesObj).forEach(id => {
  const r2 = new RegExp(`({"id":"${id}"[^}]*"y":)\\s*\\d+(,\\s*"x":\\s*)\\d+(\\s*})`, 'g');
  if(updatedNodes.match(r2)){
    updatedNodes = updatedNodes.replace(r2, `$1${tNodesObj[id].y}$2${tNodesObj[id].x}$3`);
  } else {
      // fallback for some objects that might be missing one or the other
      const r3 = new RegExp(`({"id":"${id}"[^}]*})`, 'g');
      // let's just ignore for now
  }
});

fs.writeFileSync('src/data/nodeMaster.js', updatedNodes);
console.log('Done');
