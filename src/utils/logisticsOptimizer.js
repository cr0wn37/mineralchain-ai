// src/utils/logisticsOptimizer.js

/**
 * CORE LOGIC: Total Time to Sea (TTS) = Drive Time + Port Wait Time
 * This function evaluates multiple ports to find the fastest true export route.
 */

export const analyzeLogisticsRoutes = async (mineLocation, availablePorts) => {
  console.log(`[Optimizer] Analyzing routes from: ${mineLocation.name}...`);

  // 1. Array to hold our final calculations
  let evaluatedRoutes = [];
  let fastestRoute = null;
  let lowestTotalTime = Infinity;

  // 2. Loop through all available ports for this mine
  for (const port of availablePorts) {
    
    // --- GOOGLE MAPS API INTEGRATION POINT ---
    // In production, this calls: fetch(`https://maps.googleapis.com/maps/api/distancematrix/...`)
    // For the Antler MVP, we simulate the API response based on distance.
    const simulatedDriveTimeHours = mockGoogleMapsCall(mineLocation.coordinates, port.coordinates);
    
    // 3. Calculate the True Total Time
    // Drive Time + Hours until the next cargo ship leaves
    const totalTimeHours = simulatedDriveTimeHours + port.nextShipmentHours;

    const routeResult = {
      portName: port.name,
      driveTime: simulatedDriveTimeHours,
      waitTime: port.nextShipmentHours,
      totalTime: totalTimeHours,
      isWinner: false
    };

    evaluatedRoutes.push(routeResult);

    // 4. Check if this is the fastest route so far
    if (totalTimeHours < lowestTotalTime) {
      lowestTotalTime = totalTimeHours;
      fastestRoute = routeResult;
    }
  }

  // 5. Mark the winning route
  if (fastestRoute) {
    fastestRoute.isWinner = true;
  }

  return {
    winner: fastestRoute,
    comparison: evaluatedRoutes
  };
};

// --- MVP MOCK FUNCTION (Replace with real Google API later) ---
// This roughly estimates driving time at 40 km/h based on straight-line distance
const mockGoogleMapsCall = (coord1, coord2) => {
  // Simple Pythagorean distance calculation for the mock
  const latDiff = coord1[0] - coord2[0];
  const lonDiff = coord1[1] - coord2[1];
  const rawDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  
  // Convert map degrees to rough kilometers (1 degree ~ 111km)
  const roughKilometers = rawDistance * 111;
  
  // Assume trucks average 40 km/h on Indian mining roads
  const driveTimeHours = Math.round(roughKilometers / 40); 
  
  // Ensure it takes at least 1 hour
  return Math.max(1, driveTimeHours); 
};