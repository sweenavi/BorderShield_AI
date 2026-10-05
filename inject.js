const fs = require('fs');
let c = fs.readFileSync('./src/data/nodeMaster.js', 'utf8');
c = c.replace('];', '  {"id":"J15","name":"Junction 15","type":"J","elevation":5000,"lat":null,"lng":null,"y":700,"x":200},\n];');
fs.writeFileSync('./src/data/nodeMaster.js', c);
