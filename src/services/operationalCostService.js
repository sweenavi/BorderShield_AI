export const operationalCostService = {
  calculateDynamicCost: (operationalRisk, distance, speedResult) => {
    // FRONTEND PROTOTYPE STRATEGY (EDGE-PENALTY METHOD)
    // As indicated in the UI, we dynamically calculate the edge weight by heavily 
    // penalizing distance using the operational risk factor.
    // If Risk is 0, cost is the true distance.
    // If Risk is 100, cost is multiplied to strongly dissuade Dijkstra from using it.
    const riskMultiplier = 1 + (operationalRisk / 100);
    return Math.round((distance * riskMultiplier) * 100) / 100;
  }
};
