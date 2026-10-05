import { routingService } from './src/services/routingService.js';
console.log('Calculating L01 to L20...');
const res = routingService.calculateRoute('L01', 'L20');
if (res) {
  console.log('Path:', res.recommended.path.join(' -> '));
} else {
  console.log('No route found!');
}
