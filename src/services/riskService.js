// Final BorderShield AI Multi-Criteria Risk Evaluation Engine (MCREE) Standardization
// As per "Risk Assignment.txt" and "Standardizarion Doc.txt"

export const riskService = {
  weights: {
    weather: 0.50,
    terrain: 0.30,
    road: 0.20
  },

  standardizeWeather: (weather) => {
    // 1. Temperature Risk
    // Minimum: -40°C, Cold Threshold: -10°C, Hot Threshold: 25°C, Maximum: 30°C
    let tempRisk = 0;
    const temp = weather['Temperature (°C)'] || 0;
    if (temp <= -10) {
      tempRisk = ((-10 - temp) / 30) * 100;
    } else if (temp >= 25) {
      tempRisk = ((temp - 25) / 5) * 100;
    } else {
      tempRisk = 0;
    }
    tempRisk = Math.max(0, Math.min(100, tempRisk));

    // 2. Wind Speed Risk
    // Minimum: 0, Normal Threshold: 30, Maximum: 70
    let windRisk = 0;
    const wind = weather['Wind Speed (km/h)'] || 0;
    if (wind > 30 && wind < 70) {
      windRisk = ((wind - 30) / 40) * 100;
    } else if (wind >= 70) {
      windRisk = 100;
    }
    
    // 3. Rainfall Risk
    let rainRisk = 0;
    const rainRaw = weather.Rainfall || 'No';
    const rain = typeof rainRaw === 'number' ? rainRaw : (rainRaw === 'Yes' || rainRaw.includes('Heavy') ? 50 : 0);
    if (rain > 50) rainRisk = 100;
    else if (rain > 20) rainRisk = 80;
    else if (rain > 5) rainRisk = 50;
    else if (rain >= 1) rainRisk = 20;
    else rainRisk = 0;

    // 4. Snowfall Risk
    let snowRisk = 0;
    const snowRaw = weather.Snowfall || 'No';
    const snow = typeof snowRaw === 'number' ? snowRaw : (snowRaw === 'Yes' || snowRaw.includes('Heavy') ? 50 : 0);
    if (snow > 50) snowRisk = 100;
    else if (snow >= 50) snowRisk = 80;
    else if (snow >= 20) snowRisk = 50;
    else if (snow >= 5) snowRisk = 20;
    else snowRisk = 0;

    // 5. Visibility Risk
    let visRisk = 0;
    const visRaw = weather.Visibility || 'Excellent';
    if (typeof visRaw === 'number') {
      if (visRaw <= 50) visRisk = 100;
      else if (visRaw <= 200) visRisk = 70;
      else if (visRaw <= 500) visRisk = 40;
      else if (visRaw <= 1000) visRisk = 20;
      else visRisk = 0;
    } else {
      if (visRaw.includes('Poor')) visRisk = 100;
      else if (visRaw.includes('Moderate')) visRisk = 40;
      else visRisk = 0;
    }

    // Aggregate Weather Risk
    return Math.round((tempRisk + windRisk + rainRisk + snowRisk + visRisk) / 5);
  },

  standardizeTerrain: (terrain) => {
    // 6. Terrain Type Risk
    let typeRisk = 0;
    const tType = terrain['Terrain Type'] || 'Mountain';
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
    const e = terrain['Avg Elevation (m)'] || 3000;
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
    const lRisk = terrain['Landslide Risk'] || 'No';
    if (lRisk === 'High') landRisk = 100;
    else if (lRisk === 'Medium') landRisk = 60;
    else if (lRisk === 'Low') landRisk = 25;

    // 9. Avalanche Risk
    let avaRisk = 0;
    const aRisk = terrain['Avalanche Risk'] || 'No';
    if (aRisk === 'Very High') avaRisk = 100;
    else if (aRisk === 'High') avaRisk = 75;
    else if (aRisk === 'Medium') avaRisk = 45;
    else if (aRisk === 'Low') avaRisk = 20;

    // 10. Water Crossing Risk
    let waterRisk = terrain['Water Crossing'] === 'Yes' ? 60 : 0;

    return Math.round((typeRisk + elevRisk + landRisk + avaRisk + waterRisk) / 5);
  },

  standardizeRoad: (road) => {
    // 11. Road Type Risk
    let typeRisk = 30; // Default
    const rt = road['Road Type'] || 'Paved';
    if (rt.includes('Ice')) typeRisk = 80;
    else if (rt.includes('Snow')) typeRisk = 70;
    else if (rt === 'Gravel') typeRisk = 40;
    else if (rt === 'Unpaved') typeRisk = 35;
    else if (rt === 'Paved' || rt.includes('Urban')) typeRisk = 10;

    // 12. Surface Type Risk
    let surfRisk = 0;
    const st = road['Surface Type'] || 'Asphalt';
    if (st === 'Snow/Ice' || st === 'Ice') surfRisk = 80;
    else if (st === 'Compacted Snow') surfRisk = 50;
    else if (st === 'Gravel') surfRisk = 20;
    else if (st === 'Asphalt') surfRisk = 0;

    // 13. Condition Risk
    let condRisk = 0;
    // Condition could be from terrain's Road Condition or just mapped
    return Math.round((typeRisk + surfRisk + condRisk) / 3);
  },

  evaluateEdgeCost: (weather, terrain, roadRaw) => {
    const wRisk = riskService.standardizeWeather(weather || {});
    const tRisk = riskService.standardizeTerrain(terrain || {});
    const rRisk = riskService.standardizeRoad(roadRaw || {});

    // MCREE Operational Risk Calculation using official weights
    const operationalRisk = Math.round(
      (wRisk * riskService.weights.weather) +
      (tRisk * riskService.weights.terrain) +
      (rRisk * riskService.weights.road)
    );

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
