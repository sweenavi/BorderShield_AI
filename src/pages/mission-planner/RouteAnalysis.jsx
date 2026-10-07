import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService, classifyRisk } from '../../services/routingService';
import { riskService } from '../../services/riskService';
import { nodeMaster } from '../../data/nodeMaster';
import { OperationalMap } from '../../components/common/OperationalMap';
import { Button } from '../../components/common/Button';

const mono = { fontFamily: 'var(--font-mono)' };
const sectionTitle = { fontSize: '0.9375rem', fontWeight: 'bold', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px', letterSpacing: '0.05em', ...mono };
const subTitle = { fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.08em', ...mono };
const kvGrid = { display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 16px', fontSize: '0.8125rem', color: 'var(--text-primary)', ...mono };
const thStyle = { padding: '8px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.6875rem', letterSpacing: '0.05em' };
const tdStyle = { padding: '8px', borderBottom: '1px solid var(--border-medium)', fontSize: '0.75rem' };
const panelStyle = { backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '24px', marginBottom: '24px' };

export const RouteAnalysis = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [routeResult, setRouteResult] = useState(null);
  const [mission, setMission] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); // 0 = recommended

  useEffect(() => {
    const m = missionService.getMissionById(missionId);
    if (m) {
      setMission(m);
      const stored = missionService.getRouteResult(missionId);
      setRouteResult(stored);
    }
  }, [missionId]);

  if (!mission) return <div style={{ color: 'var(--text-primary)', padding: '24px', ...mono }}>LOCATING MISSION DATA...</div>;
  if (!routeResult) return <div style={{ color: 'var(--status-danger)', padding: '24px', ...mono }}>NO FEASIBLE ROUTE DISCOVERED. GRAPH DISCONNECTED.</div>;

  // Get all routes for selection
  const allRoutes = [routeResult.recommended, ...routeResult.alternatives];
  const currentRoute = allRoutes[selectedRouteIndex] || routeResult.recommended;
  const rec = routeResult.recommended;

  const isEditable = !mission || mission.status === 'DRAFT' || mission.status === 'RETURNED FOR REVISION';

  const handleSubmitAuth = () => {
    missionService.updateMissionStatus(missionId, 'PENDING AUTHORIZATION');
    navigate('/planner/dashboard');
  };

  const getRiskColor = (r) => classifyRisk(r).color;

  // Use first segment for representative MCREE trace (source edge)
  const firstSeg = currentRoute.segments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>ROUTE ANALYSIS & RISK PREDICTION</h1>
          <p style={{ color: 'var(--accent-gold)', fontSize: '0.8125rem', marginTop: '8px', letterSpacing: '0.05em', ...mono }}>MISSION: {missionId} | STATUS: <span style={{ color: 'var(--status-warning)' }}>{mission.status}</span></p>
        </div>
        {isEditable && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={() => navigate('/planner/dashboard')}>SAVE DRAFT</Button>
            <Button variant="primary" onClick={handleSubmitAuth}>SUBMIT FOR AUTHORIZATION</Button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>

        {/* LEFT: Map + Segment Table */}
        <div style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* C. OPERATIONAL MAP */}
          <div style={{ ...panelStyle, padding: 0, display: 'flex', flexDirection: 'column', height: '450px' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.6875rem', letterSpacing: '0.08em', ...mono }}>OPERATIONAL MAP VISUALIZATION</div>
            <div style={{ flex: 1 }}>
              <OperationalMap
                key={`map-${currentRoute.id}`}
                routeSegments={currentRoute.segments}
                alternativeRoutes={allRoutes.filter((_, i) => i !== selectedRouteIndex).map(r => r.segments)}
                highlightNodes={[mission.sourceId, mission.destinationId]}
                interactive={true}
              />
            </div>
          </div>

          {/* E. BDMRA DYNAMIC EDGE WEIGHT TABLE */}
          <div style={panelStyle}>
            <div style={sectionTitle}>BDMRA — DYNAMIC EDGE WEIGHT TABLE</div>
            <div style={subTitle}>BORDERSHIELD DYNAMIC MULTI-CRITERIA ROUTING ALGORITHM</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', ...mono }}>
                <thead>
                  <tr>
                    <th style={thStyle}>SEGMENT</th>
                    <th style={thStyle}>ROAD ID</th>
                    <th style={thStyle}>DISTANCE (KM)</th>
                    <th style={thStyle}>WEATHER RISK</th>
                    <th style={thStyle}>TERRAIN RISK</th>
                    <th style={thStyle}>ROAD RISK</th>
                    <th style={thStyle}>MCREE RISK</th>
                    <th style={thStyle}>DYNAMIC COST</th>
                    <th style={thStyle}>ETA (MIN)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoute.segments.map((seg, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{seg.from} → {seg.to}</td>
                      <td style={tdStyle}>{seg.roadId}</td>
                      <td style={tdStyle}>{seg.distance}</td>
                      <td style={{ ...tdStyle, color: getRiskColor(seg.weatherRisk) }}>{seg.weatherRisk}</td>
                      <td style={{ ...tdStyle, color: getRiskColor(seg.terrainRisk) }}>{seg.terrainRisk}</td>
                      <td style={{ ...tdStyle, color: getRiskColor(seg.roadRisk) }}>{seg.roadRisk}</td>
                      <td style={{ ...tdStyle, color: getRiskColor(seg.operationalRisk), fontWeight: 'bold' }}>{seg.operationalRisk}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{seg.dynamicCost}</td>
                      <td style={tdStyle}>{Math.round(seg.segmentETA * 10) / 10}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--accent-gold)' }}>
                    <td style={tdStyle} colSpan="2">TOTAL</td>
                    <td style={tdStyle}>{currentRoute.metrics.totalDistance}</td>
                    <td style={tdStyle} colSpan="3"></td>
                    <td style={{ ...tdStyle, color: getRiskColor(currentRoute.metrics.averageRisk) }}>{currentRoute.metrics.averageRisk}</td>
                    <td style={{ ...tdStyle, color: 'var(--accent-gold)' }}>{currentRoute.metrics.cumulativeCost}</td>
                    <td style={tdStyle}>{Math.round(currentRoute.metrics.totalETA)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Text Output Blocks */}
        <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '0px' }}>

          {/* A. MISSION SUMMARY */}
          <div style={panelStyle}>
            <div style={sectionTitle}>MISSION</div>
            <div style={kvGrid}>
              <div>Source</div><div style={{ color: 'var(--accent-gold)' }}>{mission.sourceId} — {nodeMaster.find(n => n.id === mission.sourceId)?.name}</div>
              <div>Destination</div><div style={{ color: 'var(--accent-gold)' }}>{mission.destinationId} — {nodeMaster.find(n => n.id === mission.destinationId)?.name}</div>
              <div>Mission Type</div><div>{mission.missionType || '—'}</div>
              <div>Vehicle</div><div>{mission.vehicleType || '—'}</div>
              <div>Vehicle Count</div><div>{mission.vehicleCount || 1}</div>
              <div>Priority</div><div>{mission.priority || '—'}</div>
            </div>
          </div>

          {/* B. RECOMMENDED ROUTE */}
          <div style={panelStyle}>
            <div style={sectionTitle}>RECOMMENDED ROUTE</div>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.875rem', lineHeight: '2', ...mono }}>
              {currentRoute.path.join(' → ')}
            </div>
            <div style={{ ...kvGrid, marginTop: '16px' }}>
              <div>Distance</div><div>{currentRoute.metrics.totalDistance} km</div>
              <div>ETA</div><div>{Math.floor(currentRoute.metrics.totalETA / 60)} hr {Math.round(currentRoute.metrics.totalETA % 60)} min</div>
              <div>MCREE Operational Risk</div><div style={{ color: getRiskColor(currentRoute.metrics.averageRisk), fontWeight: 'bold' }}>{currentRoute.metrics.averageRisk} / 100</div>
              <div>Risk Classification</div><div style={{ color: currentRoute.metrics.riskClassification.color, fontWeight: 'bold' }}>{currentRoute.metrics.riskClassification.label}</div>
              <div>Cumulative Operational Cost</div><div style={{ fontWeight: 'bold' }}>{currentRoute.metrics.cumulativeCost}</div>
              <div>Route Status</div><div style={{ color: 'var(--accent-gold)' }}>{currentRoute.classification || 'RECOMMENDED'}</div>
            </div>
          </div>

          {/* D. MCREE RISK ANALYSIS */}
          {firstSeg && (
            <div style={panelStyle}>
              <div style={sectionTitle}>MCREE — RISK EVALUATION</div>
              <div style={subTitle}>MULTI-CRITERIA RISK EVALUATION ENGINE</div>

              {/* Weather */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ ...subTitle, color: 'var(--text-secondary)', marginTop: '12px' }}>WEATHER (First Segment: {firstSeg.from} → {firstSeg.to})</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono, fontSize: '0.75rem' }}>
                  <thead><tr><th style={thStyle}>PARAMETER</th><th style={thStyle}>RAW VALUE</th><th style={thStyle}>STD. RISK</th></tr></thead>
                  <tbody>
                    <tr><td style={tdStyle}>Temperature</td><td style={tdStyle}>{firstSeg.rawWeather?.temperature}°C</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Snowfall</td><td style={tdStyle}>{firstSeg.rawWeather?.snowfall} mm</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Visibility</td><td style={tdStyle}>{firstSeg.rawWeather?.visibility} m</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Wind Speed</td><td style={tdStyle}>{firstSeg.rawWeather?.windSpeed} km/h</td><td style={tdStyle}>—</td></tr>
                    <tr style={{ fontWeight: 'bold' }}><td style={tdStyle}>Weather Risk</td><td style={tdStyle}>—</td><td style={{ ...tdStyle, color: getRiskColor(firstSeg.weatherRisk) }}>{firstSeg.weatherRisk} / 100</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Terrain */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ ...subTitle, color: 'var(--text-secondary)' }}>TERRAIN</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono, fontSize: '0.75rem' }}>
                  <thead><tr><th style={thStyle}>PARAMETER</th><th style={thStyle}>RAW VALUE</th><th style={thStyle}>STD. RISK</th></tr></thead>
                  <tbody>
                    <tr><td style={tdStyle}>Elevation</td><td style={tdStyle}>{firstSeg.rawTerrain?.elevation} m</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Terrain Type</td><td style={tdStyle}>{firstSeg.rawTerrain?.terrainType}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Landslide Risk</td><td style={tdStyle}>{firstSeg.rawTerrain?.landslideRisk}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Avalanche Risk</td><td style={tdStyle}>{firstSeg.rawTerrain?.avalancheRisk}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Water Crossing</td><td style={tdStyle}>{firstSeg.rawTerrain?.waterCrossing ? 'Yes' : 'No'}</td><td style={tdStyle}>—</td></tr>
                    <tr style={{ fontWeight: 'bold' }}><td style={tdStyle}>Terrain Risk</td><td style={tdStyle}>—</td><td style={{ ...tdStyle, color: getRiskColor(firstSeg.terrainRisk) }}>{firstSeg.terrainRisk} / 100</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Road */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ ...subTitle, color: 'var(--text-secondary)' }}>ROAD INFRASTRUCTURE</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono, fontSize: '0.75rem' }}>
                  <thead><tr><th style={thStyle}>PARAMETER</th><th style={thStyle}>RAW VALUE</th><th style={thStyle}>STD. RISK</th></tr></thead>
                  <tbody>
                    <tr><td style={tdStyle}>Road Type</td><td style={tdStyle}>{firstSeg.roadType}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Surface Type</td><td style={tdStyle}>{firstSeg.surfaceType}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Condition</td><td style={tdStyle}>{firstSeg.roadCondition}</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Width</td><td style={tdStyle}>N/A</td><td style={tdStyle}>—</td></tr>
                    <tr><td style={tdStyle}>Curvature</td><td style={tdStyle}>N/A</td><td style={tdStyle}>—</td></tr>
                    <tr style={{ fontWeight: 'bold' }}><td style={tdStyle}>Road Risk</td><td style={tdStyle}>—</td><td style={{ ...tdStyle, color: getRiskColor(firstSeg.roadRisk) }}>{firstSeg.roadRisk} / 100</td></tr>
                  </tbody>
                </table>
              </div>

              {/* AHP Aggregation */}
              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '16px' }}>
                <div style={{ ...subTitle, color: 'var(--text-secondary)' }}>AHP AGGREGATION (FROZEN WEIGHTS)</div>
                <div style={{ ...kvGrid, fontSize: '0.75rem' }}>
                  <div>Weather Risk × {routeResult.mcree.weights.weather}</div><div>{firstSeg.weatherRisk} × {routeResult.mcree.weights.weather} = {Math.round(firstSeg.weatherRisk * routeResult.mcree.weights.weather * 100) / 100}</div>
                  <div>Terrain Risk × {routeResult.mcree.weights.terrain}</div><div>{firstSeg.terrainRisk} × {routeResult.mcree.weights.terrain} = {Math.round(firstSeg.terrainRisk * routeResult.mcree.weights.terrain * 100) / 100}</div>
                  <div>Road Risk × {routeResult.mcree.weights.road}</div><div>{firstSeg.roadRisk} × {routeResult.mcree.weights.road} = {Math.round(firstSeg.roadRisk * routeResult.mcree.weights.road * 100) / 100}</div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '1rem', fontWeight: 'bold', color: getRiskColor(firstSeg.operationalRisk), ...mono }}>
                  MCREE OPERATIONAL RISK: {firstSeg.operationalRisk} / 100
                </div>
              </div>
            </div>
          )}

          {/* F. DIJKSTRA */}
          <div style={panelStyle}>
            <div style={sectionTitle}>DIJKSTRA — ROUTING</div>
            <div style={subTitle}>STANDARD DIJKSTRA SHORTEST-PATH ALGORITHM ON WEIGHTED GRAPH</div>
            <div style={{ ...kvGrid, marginBottom: '16px' }}>
              <div>Objective</div><div>Minimum cumulative operational cost</div>
              <div>Graph</div><div>BDMRA Dynamically Weighted Road Graph</div>
            </div>
            <div style={{ ...subTitle, color: 'var(--text-secondary)' }}>SELECTED PATH</div>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.875rem', lineHeight: '1.8', ...mono }}>
              {currentRoute.path.map((nodeId, i) => (
                <span key={nodeId}>
                  {i > 0 && <span style={{ color: 'var(--text-muted)' }}> → </span>}
                  <span style={{ color: nodeId.startsWith('J') ? 'var(--text-muted)' : 'var(--accent-gold)' }}>{nodeId}</span>
                </span>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)', ...mono }}>
              CUMULATIVE COST: {currentRoute.metrics.cumulativeCost}
            </div>
          </div>

          {/* G. ALTERNATIVE ROUTES */}
          <div style={panelStyle}>
            <div style={sectionTitle}>ALTERNATIVE ROUTES</div>
            <div style={subTitle}>DYNAMIC EDGE WEIGHT (EDGE-PENALTY METHOD)</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', ...mono }}>
                <thead>
                  <tr>
                    <th style={thStyle}>ROUTE</th>
                    <th style={thStyle}>DISTANCE</th>
                    <th style={thStyle}>ETA</th>
                    <th style={thStyle}>RISK</th>
                    <th style={thStyle}>COST</th>
                    <th style={thStyle}>CLASS</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoutes.map((r, index) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRouteIndex(index)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedRouteIndex === index ? 'var(--bg-card)' : 'transparent',
                        borderLeft: selectedRouteIndex === index ? '3px solid var(--accent-gold)' : '3px solid transparent'
                      }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: selectedRouteIndex === index ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                        {r.id === 'PRIMARY' ? 'Recommended' : r.id}
                      </td>
                      <td style={tdStyle}>{r.metrics.totalDistance} km</td>
                      <td style={tdStyle}>{Math.floor(r.metrics.totalETA / 60)}h {Math.round(r.metrics.totalETA % 60)}m</td>
                      <td style={{ ...tdStyle, color: getRiskColor(r.metrics.averageRisk) }}>{r.metrics.averageRisk}</td>
                      <td style={tdStyle}>{r.metrics.cumulativeCost}</td>
                      <td style={{ ...tdStyle, color: r.metrics.riskClassification.color }}>{r.metrics.riskClassification.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allRoutes.length === 1 && (
              <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', ...mono }}>
                No alternative routes discovered in the graph for this source/destination pair.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
