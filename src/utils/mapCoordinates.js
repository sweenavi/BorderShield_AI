import { mapNodeCoordinates } from '../data/mapNodeCoordinates.js';
import { roadGeometry } from '../data/roadGeometry.js';

export const MAP_IMAGE_DIMENSIONS = { width: 1536, height: 1024 };

// Leaflet uses [y, x] where y goes up from 0 to height, and x goes right from 0 to width
export const LEAFLET_BOUNDS = [[0, 0], [MAP_IMAGE_DIMENSIONS.height, MAP_IMAGE_DIMENSIONS.width]];

/**
 * Converts image pixel coordinates (x from left, y from top) 
 * to Leaflet CRS.Simple coordinates (lat, lng).
 */
export const imagePixelToLeaflet = (x, y) => {
  return [MAP_IMAGE_DIMENSIONS.height - y, x];
};

export const leafletToImagePixel = (lat, lng) => {
  return {
    x: Math.round(lng),
    y: Math.round(MAP_IMAGE_DIMENSIONS.height - lat)
  };
};

/**
 * Gets the authoritative visual map coordinate for a node.
 * Returns [lat, lng] for Leaflet mapping, or null if the node has no map position.
 */
export const getMapCoordinate = (nodeId) => {
  const coord = mapNodeCoordinates[nodeId];
  if (!coord) {
    return null; // reserved / not-deployed node: callers must skip it
  }
  return imagePixelToLeaflet(coord.x, coord.y);
};

/**
 * Gets the authoritative visual road geometry for a road.
 * Returns an array of [lat, lng] points starting at fromNode and ending at toNode ([] if an endpoint has no position).
 * roadGeometry waypoints are image pixels stored as [x, y].
 */
export const getRoadGeometry = (roadId, fromNodeId, toNodeId) => {
  const fromCoord = getMapCoordinate(fromNodeId);
  const toCoord = getMapCoordinate(toNodeId);
  if (!fromCoord || !toCoord) return [];
  
  let waypoints = [];
  const geom = roadGeometry[roadId];
  
  if (geom && geom.length > 0) {
    waypoints = geom.map(pt => imagePixelToLeaflet(pt[0], pt[1]));
  }
  
  return [fromCoord, ...waypoints, toCoord];
};
