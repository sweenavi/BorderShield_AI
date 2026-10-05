/**
 * Optional curved-road waypoints, image pixels stored as [x, y] on the 1536x1024 map.png.
 * Key = road ID from roadMaster (e.g. "R001"); value = intermediate points ONLY
 * (the road's start/end are added automatically from mapNodeCoordinates.js).
 * Empty = every road is drawn as a straight line between its two nodes.
 * Example:  "R050": [[480, 770], [455, 745]],
 */
export const roadGeometry = {};
