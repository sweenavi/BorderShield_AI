import { routingService } from './src/services/routingService.js';

const [src = 'L01', dst = 'CP12'] = process.argv.slice(2);
const result = routingService.calculateRoute(src, dst, {});
if (!result) {
  console.log('No path found');
} else {
  [result.recommended, ...result.alternatives].forEach(r =>
    console.log(r.id.padEnd(8), r.path.join(' > '), '|', r.metrics.totalDistance + ' km | risk', r.metrics.averageRisk, '| cost', r.metrics.cumulativeCost)
  );
}
