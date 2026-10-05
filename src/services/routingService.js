import { getAdjacencyList } from '../data/roadMaster.js';
import { nodeMaster } from '../data/nodeMaster.js';
import { weatherService } from './weatherService.js';
import { terrainService } from './terrainService.js';
import { riskService } from './riskService.js';
import { roadStatusService } from './roadStatusService.js';

// Risk Classification utility — used consistently across all pages
export const classifyRisk = (risk) => {
  if (risk >= 76) return { label: 'CRITICAL', color: '#D32F2F' };
  if (risk >= 51) return { label: 'HIGH', color: '#FF9800' };
  if (risk >= 26) return { label: 'CAUTION', color: '#C19A3F' };
  return { label: 'NORMAL', color: '#4B5320' };
};

// Priority Queue for Dijkstra
class PriorityQueue {
  constructor() { this.values = []; }
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }
  dequeue() { return this.values.shift(); }
  sort() { this.values.sort((a, b) => a.priority - b.priority); }
  isEmpty() { return this.values.length === 0; }
}

// ETA Effective Speed Calculation — frozen from ETA Designing and Standardization.txt
// V_effective = V_base * fCondition * fSurface * fVisibility * fSnow * fRain * fWind
const getEffectiveSpeed = (weather, terrain, road) => {
  // 1. Base Speed: min(V_road, V_terrain)
  let vRoad = road['Avg. Speed (km/h)'] || 35;
  let vTerrain = terrain['Avg Safe Speed (km/h)'] || 40;
  const V_base = Math.min(vRoad, vTerrain);

  // 2. Road Condition Factor
  let fCondition = 1.0;
  const cond = terrain['Road Condition'] || 'Good';
  if (cond === 'Excellent') fCondition = 1.0;
  else if (cond === 'Good') fCondition = 0.90;
  else if (cond === 'Fair') fCondition = 0.75;
  else if (cond === 'Poor' || cond === 'Severe' || cond === 'Extreme') fCondition = 0.60;

  // 3. Surface Factor
  let fSurface = 1.0;
  const st = road['Surface Type'] || 'Asphalt';
  if (st === 'Asphalt') fSurface = 1.0;
  else if (st === 'Gravel') fSurface = 0.90;
  else if (st === 'Compacted Snow') fSurface = 0.75;
  else if (st === 'Snow/Ice' || st === 'Ice') fSurface = 0.60;

  // 4. Weather Factors
  let fVisibility = 1.0;
  const vis = weather['Visibility'] || 'Excellent';
  if (typeof vis === 'number') {
    if (vis > 3000) fVisibility = 1.0;
    else if (vis > 1000) fVisibility = 0.95;
    else if (vis > 300) fVisibility = 0.85;
    else if (vis > 50) fVisibility = 0.70;
    else fVisibility = 0.50;
  } else {
    if (vis.includes('Poor')) fVisibility = 0.60;
    else if (vis.includes('Moderate')) fVisibility = 0.85;
    else fVisibility = 1.0;
  }

  let fSnow = 1.0;
  const snowRaw = weather['Snowfall'] || 'No';
  const snow = typeof snowRaw === 'number' ? snowRaw : (snowRaw === 'Yes' ? 50 : 0);
  if (snow > 50) fSnow = 0.40;
  else if (snow >= 50) fSnow = 0.60;
  else if (snow >= 20) fSnow = 0.75;
  else if (snow >= 5) fSnow = 0.90;

  let fRain = 1.0;
  const rainRaw = weather['Rainfall'] || 'No';
  const rain = typeof rainRaw === 'number' ? rainRaw : (rainRaw === 'Yes' ? 50 : 0);
  if (rain > 50) fRain = 0.50;
  else if (rain >= 21) fRain = 0.70;
  else if (rain >= 6) fRain = 0.85;
  else if (rain >= 1) fRain = 0.95;

  let fWind = 1.0;
  const wind = weather['Wind Speed (km/h)'] || 0;
  if (wind > 30 && wind < 70) {
    fWind = 1 - (((wind - 30) / 40) * 0.40);
  } else if (wind >= 70) {
    fWind = 0.60;
  }

  let V_effective = V_base * fCondition * fSurface * fVisibility * fSnow * fRain * fWind;
  if (V_effective < 5) V_effective = 5; // Minimum safety floor

  return {
    V_base,
    V_effective,
    factors: { fCondition, fSurface, fVisibility, fSnow, fRain, fWind }
  };
};

export const routingService = {

  // Internal: run Dijkstra on the weighted graph with optional edge penalties
  _calculateSingleRoute: (sourceId, destinationId, excludedEdges = []) => {
    const adj = getAdjacencyList();
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    for (let node in adj) {
      distances[node] = node === sourceId ? 0 : Infinity;
      previous[node] = null;
      if (node === sourceId) pq.enqueue(node, 0);
    }

    while (!pq.isEmpty()) {
      let current = pq.dequeue().val;

      if (current === destinationId) {
        // Reconstruct path
        let path = [];
        let currNode = current;
        while (currNode) {
          path.push(currNode);
          currNode = previous[currNode];
        }
        path.reverse();

        // Build segments with FULL raw + standardized data
        let segments = [];
        let totalRisk = 0;
        let totalDistance = 0;
        let totalETA = 0;
        let totalCost = 0;

        for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];
          const edge = adj[from].find(e => e.node === to);

          const rawWeather = edge._raw.weather || {};
          const rawTerrain = edge._raw.terrain || {};
          const rawRoad = edge._raw.road || {};

          const riskResult = riskService.evaluateEdgeCost(rawWeather, rawTerrain, rawRoad);
          const speedResult = getEffectiveSpeed(rawWeather, rawTerrain, rawRoad);
          const segmentETA_minutes = (edge.distance / speedResult.V_effective) * 60;

          totalRisk += riskResult.operationalRisk;
          totalDistance += edge.distance;
          totalETA += segmentETA_minutes;
          totalCost += riskResult.dynamicCost;

          segments.push({
            from,
            to,
            roadId: edge.roadId,
            distance: edge.distance,
            roadType: edge.type,
            surfaceType: edge.surfaceType,
            roadCondition: edge.condition,
            // Raw parameters for MCREE trace
            rawWeather,
            rawTerrain: { ...rawTerrain },
            // Standardized risks
            weatherRisk: riskResult.weatherRisk,
            terrainRisk: riskResult.terrainRisk,
            roadRisk: riskResult.roadRisk,
            operationalRisk: riskResult.operationalRisk,
            dynamicCost: riskResult.dynamicCost,
            // ETA data
            V_base: Math.round(speedResult.V_base * 100) / 100,
            V_effective: Math.round(speedResult.V_effective * 100) / 100,
            etaFactors: speedResult.factors,
            segmentETA: Math.round(segmentETA_minutes * 100) / 100
          });
        }

        const avgOperationalRisk = segments.length > 0 ? Math.round(totalRisk / segments.length) : 0;

        return {
          path,
          segments,
          metrics: {
            totalDistance: Math.round(totalDistance * 100) / 100,
            totalETA: Math.round(totalETA * 100) / 100,
            averageRisk: avgOperationalRisk,
            cumulativeCost: Math.round(totalCost),
            riskClassification: classifyRisk(avgOperationalRisk)
          }
        };
      }

      if (distances[current] !== Infinity || current === sourceId) {
        for (let neighbor of (adj[current] || [])) {
          const effStatus = roadStatusService.getEffectiveRoadStatus(neighbor.roadId);
          if (String(effStatus).toUpperCase() === 'BLOCKED') continue;

          const rawWeather = neighbor._raw.weather || {};
          const rawTerrain = neighbor._raw.terrain || {};
          const rawRoad = neighbor._raw.road || {};
          const riskEval = riskService.evaluateEdgeCost(rawWeather, rawTerrain, rawRoad);

          let edgeDynamicCost = riskEval.dynamicCost;

          // Alternative-route generation: roads in excludedEdges are removed from the graph
          // (hard exclusion, not a soft penalty, so an alternative can never silently reuse them).
          const isExcluded = excludedEdges.some(pe =>
            (pe.from === current && pe.to === neighbor.node) ||
            (pe.to === current && pe.from === neighbor.node)
          );
          if (isExcluded) continue;

          let candidate = distances[current] + edgeDynamicCost;
          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = current;
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    return null; // No path found
  },

  // PUBLIC API: Single authoritative calculation
  // Returns ONE comprehensive result object consumed by ALL pages.
  calculateRoute: (sourceId, destinationId, missionParams = {}) => {
    // 1. Primary Route via standard Dijkstra
    const primary = routingService._calculateSingleRoute(sourceId, destinationId, []);
    if (!primary) return null;
    primary.id = 'PRIMARY';
    primary.classification = 'RECOMMENDED';

    // 2. Alternative Routes — "remove one road of the best route, re-route" (single-edge-avoidance),
    //    repeated for every road on the primary route and on each alternative found, then
    //    de-duplicated and ranked. Alternatives must be genuinely different roads, not the same
    //    route with one detour node.
    const edgeKeys = (r) => r.segments.map(sg => sg.roadId);
    const overlap = (r1, r2) => {
      const k1 = new Set(edgeKeys(r1));
      const k2 = edgeKeys(r2);
      const shared = k2.filter(k => k1.has(k)).length;
      return shared / Math.max(k1.size, k2.length, 1);
    };
    const MAX_ALTERNATIVES = 2;
    const MAX_OVERLAP = 0.85; // reject candidates sharing >85% of roads with an already chosen route

    const candidates = new Map(); // pathKey -> route
    const seen = new Set([primary.path.join('>')]);
    const queue = [primary];
    let guard = 0;
    while (queue.length && guard < 12) {
      const base = queue.shift();
      guard++;
      for (const seg of base.segments) {
        const cand = routingService._calculateSingleRoute(
          sourceId, destinationId, [{ from: seg.from, to: seg.to }]
        );
        if (!cand) continue;
        const key = cand.path.join('>');
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.set(key, cand);
        if (candidates.size < 6) queue.push(cand);
      }
    }

    const ranked = [...candidates.values()].sort(
      (x, y) => x.metrics.cumulativeCost - y.metrics.cumulativeCost
    );
    const chosen = [];
    for (const cand of ranked) {
      if (chosen.length >= MAX_ALTERNATIVES) break;
      if (overlap(primary, cand) > MAX_OVERLAP) continue;
      if (chosen.some(c => overlap(c, cand) > MAX_OVERLAP)) continue;
      chosen.push(cand);
    }
    const alternatives = chosen.map((alt, i) => {
      alt.id = `ALT-${i + 1}`;
      alt.classification = 'ALTERNATIVE';
      return alt;
    });

    // 3. Return ONE authoritative result object
    return {
      mission: {
        sourceId,
        destinationId,
        ...missionParams
      },
      recommended: primary,
      alternatives,
      algoVersion: 2,
      mcree: {
        weights: { ...riskService.weights },
        methodology: 'MCREE: Multi-Criteria Risk Evaluation Engine (Frontend Prototype Defaults)'
      },
      timestamp: new Date().toISOString()
    };
  }
};
