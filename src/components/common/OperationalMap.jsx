import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { nodeMaster, NODE_TYPES } from '../../data/nodeMaster';
import { roadMaster } from '../../data/roadMaster';
import { LEAFLET_BOUNDS, imagePixelToLeaflet, getMapCoordinate, getRoadGeometry } from '../../utils/mapCoordinates';
import { Maximize, Minimize, MapPin, Layers, Navigation, Search, RotateCcw } from 'lucide-react';

// Fix Leaflet default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ── Icon Factories ───────────────────────────────────────────────────────────
const createNodeIcon = (type, isActive = false) => {
  const colors = {
    L:  { fill: '#60A5FA', stroke: '#1E40AF' },  // blue
    CP: { fill: '#F59E0B', stroke: '#92400E' },  // amber
    HP: { fill: '#22C55E', stroke: '#166534' },  // green
    RP: { fill: '#00E5FF', stroke: '#0891B2' },  // cyan
    OT: { fill: '#A855F7', stroke: '#6B21A8' },  // purple
    BR: { fill: '#3A7BD5', stroke: '#1E3A5F' },  // blue
    J:  { fill: '#304356', stroke: '#1A2E40' },  // muted (hidden by default)
  };
  const c = colors[type] || colors.L;
  const size = isActive ? 14 : 10;
  return new L.DivIcon({
    className: '',
    html: `<div style="
      width:${size}px; height:${size}px;
      background-color:${c.fill};
      border:2px solid ${c.stroke};
      border-radius:${type === 'J' ? '0' : '50%'};
      ${isActive ? `box-shadow:0 0 8px ${c.fill};` : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const createEndpointIcon = (kind) => {
  const isSource = kind === 'SOURCE';
  const color = isSource ? '#22C55E' : '#EF4444';
  const char = isSource ? '▶' : '◆';
  return new L.DivIcon({
    className: '',
    html: `<div style="
      width:18px; height:18px;
      background-color:${color};
      border:2px solid white;
      border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:8px; color:white;
      box-shadow: 0 0 12px ${color};
    ">${char}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const createPulseIcon = () => new L.DivIcon({
  className: '',
  html: `<div style="
    width:12px; height:12px;
    background-color:var(--accent-gold,#C9A84C);
    border:2px solid white; border-radius:50%;
    box-shadow: 0 0 12px var(--accent-gold,#C9A84C);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

import { roadStatusService } from '../../services/roadStatusService';

// ── Road state → visual style ─────────────────────────────────────────────────
const getRoadStyle = (road, isSelected = false, isAlternative = false) => {
  if (isSelected)     return { color: '#00E5FF', weight: 5, opacity: 0.95, dashArray: '10, 12' };
  if (isAlternative)  return { color: '#3A7BD5', weight: 3, opacity: 0.75, dashArray: '8, 8' };
  
  const status = (roadStatusService.getEffectiveRoadStatus(road.id) || '').toUpperCase();
  if (status === 'BLOCKED')     return { color: '#EF4444', weight: 2, opacity: 0.7, dashArray: '4, 8' };
  if (status === 'RESTRICTED')  return { color: '#F59E0B', weight: 2, opacity: 0.65, dashArray: '6, 6' };
  return { color: '#22C55E', weight: 1.5, opacity: 0.35, dashArray: '' }; // OPEN (background)
};

// ── Segment risk → color ──────────────────────────────────────────────────────
const riskColor = (risk) => {
  if (risk >= 76) return '#EF4444';  // critical — red
  if (risk >= 51) return '#F59E0B';  // high — amber
  if (risk >= 26) return '#00E5FF';  // caution — cyan
  return '#22C55E';                  // normal — green
};

// ── MapController ─────────────────────────────────────────────────────────────
const MapController = ({ bounds, centerOn, zoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    if (centerOn) map.flyTo(centerOn, zoomLevel || 1.5, { duration: 0.8 });
    else if (bounds) map.fitBounds(bounds);
  }, [centerOn, bounds, zoomLevel, map]);
  return null;
};

// ── OperationalMap Component ───────────────────────────────────────────────────
export const OperationalMap = ({
  height = '100%',
  routeSegments = [],
  alternativeRoutes = [],
  highlightNodes = [],
  activePosition = null,
  interactive = true,
  showAllEdges = false,
}) => {
  const [showRoads, setShowRoads] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showRiskColors, setShowRiskColors] = useState(true);
  const [centerCoord, setCenterCoord] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);

  // Build road lookup map for fast access
  const roadById = {};
  roadMaster.forEach(r => { roadById[r.id] = r; });

  // Build adj for background edges

  const [sourceId, destId] = highlightNodes;

  // Collect IDs on the primary route for highlighting
  const routeNodeSet = new Set(routeSegments.flatMap(s => [s.from, s.to]));
  const routeRoadIdSet = new Set(routeSegments.map(s => s.roadId).filter(Boolean));

  // Collect IDs on alternative routes

  // Helper: get pixel waypoints for a road ID between two nodes
  const getPixelPath = (roadId, fromNode, toNode) => {
    return getRoadGeometry(roadId, fromNode.id, toNode.id);
  };

  // Fullscreen support
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) mapContainerRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const resetView = () => setCenterCoord(null);
  const locateNode = (id) => {
    const coord = getMapCoordinate(id);
    if (coord) setCenterCoord(coord);
  };

  const ctrlBtn = (onClick, title, children, active = false) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '34px', height: '34px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: active ? 'var(--accent-cyan-dim, rgba(0,229,255,0.15))' : 'rgba(13,27,42,0.92)',
        border: active ? '1px solid var(--accent-cyan, #00E5FF)' : '1px solid var(--border-medium, #253D54)',
        color: active ? 'var(--accent-cyan, #00E5FF)' : '#8FAAB8',
        cursor: 'pointer', borderRadius: '2px',
        transition: 'all 0.15s', flexShrink: 0
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: isFullscreen ? '100vh' : height,
        width: '100%',
        backgroundColor: 'var(--bg-dark-navy, #060B12)',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Controls overlay ───────────────────────────────────────────── */}
      {interactive && (
        <>
          {/* Right column controls */}
          <div style={{
            position: 'absolute', top: 10, right: 10, zIndex: 1000,
            display: 'flex', flexDirection: 'column', gap: '6px'
          }}>
            {ctrlBtn(toggleFullscreen, isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
              isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />
            )}
            {ctrlBtn(resetView, 'Reset View', <RotateCcw size={14} />)}
            {sourceId && ctrlBtn(() => locateNode(sourceId), 'Locate Source',
              <Navigation size={14} />, false
            )}
            {destId && ctrlBtn(() => locateNode(destId), 'Locate Destination',
              <MapPin size={14} />, false
            )}
            <div style={{ width: '34px', height: '1px', backgroundColor: 'var(--border-medium)' }} />
            {ctrlBtn(() => setShowRoads(v => !v), 'Toggle Road Network', <Layers size={14} />, showRoads)}
            {ctrlBtn(() => setShowNodes(v => !v), 'Toggle Nodes', <Navigation size={14} />, showNodes)}
            {ctrlBtn(() => setShowRiskColors(v => !v), 'Toggle Risk Colors', <Search size={14} />, showRiskColors)}
          </div>

          {/* Node search bar */}
          <div style={{
            position: 'absolute', top: 10, left: 10, zIndex: 1000,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'rgba(13,27,42,0.92)',
              border: '1px solid var(--border-medium)',
              padding: '0 10px', height: '34px'
            }}>
              <Search size={12} color="var(--text-secondary)" />
              <select
                onChange={e => e.target.value && locateNode(e.target.value)}
                defaultValue=""
                style={{
                  background: 'none', color: '#F0F4F8',
                  border: 'none', outline: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  width: '220px', cursor: 'pointer'
                }}
              >
                <option value="">Locate Operational Point…</option>
                {nodeMaster.filter(n => n.type !== 'J' && !n.reserved).map(n => (
                  <option key={n.id} value={n.id}>{n.id} — {n.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10, zIndex: 1000,
            backgroundColor: 'rgba(13,27,42,0.92)',
            border: '1px solid var(--border-medium)',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: '#8FAAB8', lineHeight: 1.8
          }}>
            {[
              { color: '#22C55E', label: 'Open', dash: '' },
              { color: '#F59E0B', label: 'Restricted', dash: '6px' },
              { color: '#EF4444', label: 'Blocked', dash: '4px' },
              { color: '#00E5FF', label: 'Selected Route', dash: '10px' },
              { color: '#3A7BD5', label: 'Alternative', dash: '8px' },
            ].map(({ color, label, dash }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="24" height="4" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="2" x2="24" y2="2" stroke={color} strokeWidth="2.5"
                    strokeDasharray={dash || ''} />
                </svg>
                {label}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          bounds={LEAFLET_BOUNDS}
          crs={L.CRS.Simple}
          minZoom={-1} maxZoom={4}
          maxBounds={LEAFLET_BOUNDS} maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%', backgroundColor: '#060B12' }}
          dragging={interactive}
          scrollWheelZoom={interactive}
          doubleClickZoom={interactive}
          zoomControl={interactive}
        >
          <MapController
            bounds={centerCoord ? null : LEAFLET_BOUNDS}
            centerOn={centerCoord}
            zoomLevel={1.5}
          />

          {/* Layer 1: Background image */}
          <ImageOverlay url="/map.png" bounds={LEAFLET_BOUNDS} opacity={0.85} />

          {/* Layer 2: Background road network */}
          {showRoads && roadMaster.map(road => {
            const fromNode = nodeMaster.find(n => n.id === road.from);
            const toNode   = nodeMaster.find(n => n.id === road.to);
            if (!fromNode || !toNode) return null;

            // Don't render background for roads that are on the selected route
            if (routeRoadIdSet.has(road.id)) return null;

            const style = getRoadStyle(road);
            const pts = getPixelPath(road.id, fromNode, toNode);
            if (pts.length < 2) return null;

            return (
              <Polyline
                key={`bg-${road.id}`}
                positions={pts}
                color={style.color}
                weight={style.weight}
                opacity={style.opacity}
                dashArray={style.dashArray || null}
              >
                {interactive && (
                  <Tooltip sticky>
                    <div style={{
                      fontFamily: 'monospace', fontSize: '11px',
                      color: '#F0F4F8', lineHeight: 1.6
                    }}>
                      <strong style={{ color: '#C9A84C' }}>ROAD {road.id}</strong><br />
                      {road.from} → {road.to}<br />
                      <span style={{ color: '#8FAAB8' }}>Distance:</span> {road.distanceKm} km<br />
                      <span style={{ color: '#8FAAB8' }}>Surface:</span> {road.surfaceType}<br />
                      <span style={{ color: '#8FAAB8' }}>Status:</span>{' '}
                      <span style={{
                        color: roadStatusService.getEffectiveRoadStatus(road.id) === 'Open' ? '#22C55E'
                          : roadStatusService.getEffectiveRoadStatus(road.id) === 'Blocked' ? '#EF4444' : '#F59E0B'
                      }}>
                        {roadStatusService.getEffectiveRoadStatus(road.id)?.toUpperCase()}
                      </span>
                    </div>
                  </Tooltip>
                )}
              </Polyline>
            );
          })}

          {/* Layer 3a: Alternative route overlays */}
          {alternativeRoutes.map((altSegs, rIdx) =>
            altSegs.map((seg, sIdx) => {
              const fromNode = nodeMaster.find(n => n.id === seg.from);
              const toNode   = nodeMaster.find(n => n.id === seg.to);
              if (!fromNode || !toNode) return null;
              const pts = getPixelPath(seg.roadId, fromNode, toNode);
              if (pts.length < 2) return null;
              return (
                <Polyline
                  key={`alt-${rIdx}-${sIdx}`}
                  positions={pts}
                  color="#3A7BD5"
                  weight={3}
                  opacity={0.7}
                  dashArray="8, 8"
                />
              );
            })
          )}

          {/* Layer 3b: Primary selected route (animated, risk-colored) */}
          {routeSegments.map((seg, idx) => {
            const fromNode = nodeMaster.find(n => n.id === seg.from);
            const toNode   = nodeMaster.find(n => n.id === seg.to);
            if (!fromNode || !toNode) return null;

            const color = showRiskColors
              ? riskColor(seg.operationalRisk || 0)
              : '#00E5FF';

            const pts = getPixelPath(seg.roadId, fromNode, toNode);
            if (pts.length < 2) return null;

            return (
              <React.Fragment key={`route-${idx}`}>
                {/* Glow layer */}
                <Polyline positions={pts} color={color} weight={10} opacity={0.12} />
                {/* Main route */}
                <Polyline
                  positions={pts}
                  color={color}
                  weight={4}
                  opacity={0.95}
                  className="animated-route-flow"
                >
                  <Tooltip sticky>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F0F4F8', lineHeight: 1.6 }}>
                      <strong style={{ color: '#C9A84C' }}>ROAD {seg.roadId}</strong><br />
                      {seg.from} → {seg.to}<br />
                      <span style={{ color: '#8FAAB8' }}>Distance:</span> {seg.distance} km<br />
                      <span style={{ color: '#8FAAB8' }}>MCREE Risk:</span>{' '}
                      <strong style={{ color }}>{seg.operationalRisk}</strong><br />
                      <span style={{ color: '#8FAAB8' }}>ETA Segment:</span> {seg.segmentETA?.toFixed(1)} min
                    </div>
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            );
          })}

          {/* Layer 3c: Node markers */}
          {showNodes && nodeMaster.map(node => {
            const isSource   = node.id === sourceId;
            const isDest     = node.id === destId;
            const isOnRoute  = routeNodeSet.has(node.id);

            // Hide junction nodes unless on route
            if (node.type === 'J' && !isOnRoute) return null;
            // Skip zero-coord nodes (bad data)
            const coord = getMapCoordinate(node.id);
            if (!coord || (coord[0] === 1024 && coord[1] === 0)) return null;

            const icon = isSource
              ? createEndpointIcon('SOURCE')
              : isDest
              ? createEndpointIcon('DEST')
              : createNodeIcon(node.type, isOnRoute);

            return (
              <Marker
                key={node.id}
                position={getMapCoordinate(node.id)}
                icon={icon}
                zIndexOffset={isSource || isDest ? 2000 : isOnRoute ? 500 : 0}
              >
                <Popup closeButton={false}>
                  <div style={{
                    fontFamily: 'monospace', fontSize: '12px',
                    minWidth: '160px', lineHeight: 1.7
                  }}>
                    <div style={{ fontWeight: 700, color: '#C9A84C', marginBottom: '4px' }}>
                      {node.id}{isSource ? ' ◀ SOURCE' : isDest ? ' ▶ DEST' : ''}
                    </div>
                    <div style={{ color: '#F0F4F8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      {node.name}
                    </div>
                    <div style={{ color: '#8FAAB8', fontSize: '11px' }}>
                      Type: {NODE_TYPES[node.type]?.label || node.type}<br />
                      {node.elevation && <>Elevation: {node.elevation} m<br /></>}
                      {node.lat && <>Lat/Lng: {node.lat}°N, {node.lng}°E</>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Active position pulse marker */}
          {activePosition && (() => {
            let pos;
            if (typeof activePosition === 'string') {
              const n = nodeMaster.find(n => n.id === activePosition);
              pos = n ? getMapCoordinate(n.id) : null;
            } else {
              pos = activePosition;
            }
            if (!pos) return null;
            return (
              <Marker position={pos} icon={createPulseIcon()} zIndexOffset={3000}>
                <Tooltip permanent direction="bottom" offset={[0, 8]}>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#C9A84C' }}>
                    CURRENT POSITION
                  </span>
                </Tooltip>
              </Marker>
            );
          })()}

        </MapContainer>
      </div>

      {/* Global Leaflet style overrides */}
      <style>{`
        .leaflet-tooltip {
          background-color: rgba(13,27,42,0.95) !important;
          border: 1px solid #253D54 !important;
          color: #F0F4F8 !important;
          border-radius: 0 !important;
          padding: 6px 10px !important;
          box-shadow: none !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: #0D1B2A !important;
          border: 1px solid #1A2E40 !important;
          color: #F0F4F8 !important;
          border-radius: 0 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip { background-color: #0D1B2A !important; }
        .leaflet-control-zoom a {
          background-color: rgba(13,27,42,0.92) !important;
          border-color: #253D54 !important;
          color: #8FAAB8 !important;
          border-radius: 0 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: rgba(0,229,255,0.1) !important;
          color: #00E5FF !important;
        }
        .animated-route-flow {
          stroke-dasharray: 12, 14;
          animation: routeFlow 1.5s linear infinite;
        }
        @keyframes routeFlow {
          0%   { stroke-dashoffset: 26; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};
