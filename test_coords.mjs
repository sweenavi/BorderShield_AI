import { mapNodeCoordinates } from './src/data/mapNodeCoordinates.js';
import { getAdjacencyList } from './src/data/roadMaster.js';
const path = ['L01', 'CP01', 'BR01', 'J6', 'L03', 'J7', 'RP06', 'L13', 'J14', 'L20'];
const missing = path.filter(id => !mapNodeCoordinates[id]);
console.log('Missing coordinates for:', missing);

const adj = getAdjacencyList();
console.log('Adjacency list length:', Object.keys(adj).length);
