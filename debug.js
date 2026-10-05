import fs from 'fs';
import { routingService } from './src/services/routingService.js';

try {
  const result = routingService.calculateRoute('L01', 'L20', {});
  fs.writeFileSync('debug.log', 'SUCCESS: ' + JSON.stringify(result));
} catch (e) {
  fs.writeFileSync('debug.log', 'ERROR: ' + e.message + '\n' + e.stack);
}
