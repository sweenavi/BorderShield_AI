// Final BorderShield AI Multi-Criteria Risk Evaluation Engine (MCREE) Standardization
// As per "Risk Assignment.txt" and "Standardizarion Doc.txt"

export const riskService = {
  weights: {
    weather: 0.40,
    terrain: 0.40,
    road: 0.20
  },

  standardizeWeather: (weather) => {
    // 1. Temperature Risk
    // Minimum: -40°C, Cold Threshold: -10°C, Hot Threshold: 25°C, Maximum: 30°C
    let tempRisk = 0;
    if (weather.temperature <= -10) {
      tempRisk = ((-10 - weather.temperature) / 30) * 100;
    } else if (weather.temperature >= 25) {
      tempRisk = ((weather.temperature - 25) / 5) * 100;
    } else {
      tempRisk = 0;
    }
    tempRisk = Math.max(0, Math.min(100, tempRisk));

    // 2. Wind Speed Risk
    // Minimum: 0, Normal Threshold: 30, Maximum: 70
    let windRisk = 0;
    if (weather.windSpeed > 30 && weather.windSpeed < 70) {
      windRisk = ((weather.windSpeed - 30) / 40) * 100;
    } else if (weather.windSpeed >= 70) {
      windRisk = 100;
    }
    
    // 3. Rainfall Risk
    let rainRisk = 0;
    const rain = weather.rainfall || 0;
    if (rain > 50) rainRisk = 100;
    else if (rain > 20) rainRisk = 80;
    else if (rain > 5) rainRisk = 50;
    else if (rain >= 1) rainRisk = 20;
    else rainRisk = 0;

    // 4. Snowfall Risk
    let snowRisk = 0;
    if (weather.snowfall > 50) snowRisk = 100;
    else if (weather.snowfall >= 50) snowRisk = 80;
    else if (weather.snowfall >= 20) snowRisk = 50;
    else if (weather.snowfall >= 5) snowRisk = 20;
    else snowRisk = 0;

    // 5. Visibility Risk
    let visRisk = 0;
    if (weather.visibility <= 50) visRisk = 100; // Very Poor
    else if (weather.visibility <= 200) visRisk = 70; // Poor
    else if (weather.visibility <= 500) visRisk = 40; // Moderate
    else if (weather.visibility <= 1000) visRisk = 20; // Good
    else visRisk = 0; // Excellent

    // Aggregate Weather Risk
    return Math.round((tempRisk + windRisk + rainRisk + snowRisk + visRisk) / 5);
  },

  standardizeTerrain: (terrain) => {
    // 6. Terrain Type Risk
    let typeRisk = 0;
    const tType = terrain.terrainType || 'Mountain';
    if (tType === 'Glacier') typeRisk = 100;
    else if (tType === 'Snow') typeRisk = 80;
    else if (tType === 'Rocky Mountain') typeRisk = 70;
    else if (tType === 'Rocky') typeRisk = 60;
    else if (tType === 'Mountain') typeRisk = 50;
    else if (tType === 'Valley') typeRisk = 20;
    else if (tType === 'Plain') typeRisk = 10;
    else typeRisk = 50;

    // 7. Avg Elevation Risk
    let elevRisk = 0;
    const e = terrain.elevation || 3000;
    if (e > 6000) elevRisk = 100;
    else if (e >= 5500) elevRisk = 95;
    else if (e >= 5000) elevRisk = 80;
    else if (e >= 4500) elevRisk = 65;
    else if (e >= 4000) elevRisk = 45;
    else if (e >= 3500) elevRisk = 25;
    else if (e >= 3000) elevRisk = 10;
    else elevRisk = 0;

    // 8. Landslide Risk
    let landRisk = 0;
    const lRisk = terrain.landslideRisk || 'No';
    if (lRisk === 'High') landRisk = 100;
    else if (lRisk === 'Medium') landRisk = 60;
    else if (lRisk === 'Low') landRisk = 25;

    // 9. Avalanche Risk
    let avaRisk = 0;
    const aRisk = terrain.avalancheRisk || 'No';
    if (aRisk === 'Very High') avaRisk = 100;
    else if (aRisk === 'High') avaRisk = 75;
    else if (aRisk === 'Medium') avaRisk = 45;
    else if (aRisk === 'Low') avaRisk = 20;

    // 10. Water Crossing Risk
    let waterRisk = terrain.waterCrossing ? 60 : 0;

    return Math.round((typeRisk + elevRisk + landRisk + avaRisk + waterRisk) / 5);
  },

  standardizeRoad: (roadEdge) => {
    // 11. Road Type Risk — based on road type from roadMaster
    let typeRisk = 30; // Default
    const rt = roadEdge.type || roadEdge.roadType || 'Paved';
    if (rt.includes('Ice')) typeRisk = 80;
    else if (rt.includes('Snow')) typeRisk = 70;
    else if (rt === 'Gravel') typeRisk = 40;
    else if (rt === 'Unpaved') typeRisk = 35;
    else if (rt === 'Paved') typeRisk = 10;

    // 12. Surface Type Risk — from explicit surfaceType field in roadMaster
    let surfRisk = 0;
    const st = roadEdge.surfaceType || 'Asphalt';
    if (st === 'Snow/Ice' || st === 'Ice') surfRisk = 80;
    else if (st === 'Compacted Snow') surfRisk = 50;
    else if (st === 'Gravel') surfRisk = 20;
    else if (st === 'Asphalt') surfRisk = 0;

    // 13. Condition Risk
    let condRisk = 0;
    const cond = roadEdge.condition || 'Good';
    if (cond === 'Extreme') condRisk = 100;
    else if (cond === 'Severe') condRisk = 80;
    else if (cond === 'Poor') condRisk = 60;
    else if (cond === 'Fair') condRisk = 30;
    else if (cond === 'Good') condRisk = 10;
    else if (cond === 'Excellent') condRisk = 0;

    return Math.round((typeRisk + surfRisk + condRisk) / 3);
  },

  evaluateEdgeCost: (weather, terrain, roadEdge) => {
    const wRisk = riskService.standardizeWeather(weather);
    const tRisk = riskService.standardizeTerrain(terrain);
    const rRisk = riskService.standardizeRoad(roadEdge);

    // MCREE Operational Risk Calculation using AHP weights
    const operationalRisk = Math.round(
      (wRisk * riskService.weights.weather) +
      (tRisk * riskService.weights.terrain) +
      (rRisk * riskService.weights.road)
    );

    // BDMRA explicitly states: Edge Weight = Dynamic Operational Cost.
    // The previous formula "Distance * (1 + Risk/100)" was unsupported by the frozen documentation.
    const dynamicCost = operationalRisk;

    return {
      weatherRisk: wRisk,
      terrainRisk: tRisk,
      roadRisk: rRisk,
      operationalRisk,
      dynamicCost
    };
  }
};
