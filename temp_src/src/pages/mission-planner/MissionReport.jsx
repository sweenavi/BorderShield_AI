import React from 'react';
import { useParams } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService, classifyRisk } from '../../services/routingService';
import { nodeMaster } from '../../data/nodeMaster';

export const MissionReport = () => {
  const { missionId } = useParams();
  const mission = missionService.getMissionById(missionId);

  // Read STORED route result — never recalculate independently
  let routeResult = missionService.getRouteResult(missionId);
  if (!routeResult && mission) {
    // Fallback: calculate once and store
    routeResult = routingService.calculateRoute(mission.sourceId, mission.destinationId, mission);
    if (routeResult) missionService.saveRouteResult(missionId, routeResult);
  }

  if (!mission || !routeResult) return <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>REPORT DATA UNAVAILABLE</div>;

  const rec = routeResult.recommended;

  return (
    <div style={{ backgroundColor: '#fff', color: '#000', padding: '48px', fontFamily: 'serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <img src="/logo.png" alt="BorderShield AI Logo" style={{ height: '32px', width: 'auto', filter: 'invert(1) grayscale(1) contrast(100)' }} />
          <h1 style={{ margin: 0, fontSize: '24px' }}>BORDERSHIELD AI</h1>
        </div>
        <h2 style={{ margin: '8px 0', fontSize: '18px' }}>AFTER-ACTION MISSION REPORT</h2>
        <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>DOC ID: {missionId} | GENERATED: {new Date().toUTCString()}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '14px' }}>
        <div>
          <strong>MISSION PARAMS</strong><br/>
          Type: {mission.missionType}<br/>
          Vehicle: {mission.vehicleType}<br/>
          Vehicle Count: {mission.vehicleCount}<br/>
          Priority: {mission.priority}<br/>
        </div>
        <div>
          <strong>ROUTING SUMMARY</strong><br/>
          Source: {mission.sourceId} — {nodeMaster.find(n => n.id === mission.sourceId)?.name}<br/>
          Dest: {mission.destinationId} — {nodeMaster.find(n => n.id === mission.destinationId)?.name}<br/>
          Distance: {rec.metrics.totalDistance} km<br/>
          ETA: {Math.floor(rec.metrics.totalETA / 60)}h {Math.round(rec.metrics.totalETA % 60)}m<br/>
          MCREE Risk: {rec.metrics.averageRisk} / 100<br/>
          Classification: {rec.metrics.riskClassification.label}<br/>
          Cumulative Cost: {rec.metrics.cumulativeCost}<br/>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>DIJKSTRA ROUTE PATH</h3>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>
          {rec.path.join(' → ')}
        </div>
        
        <h3 style={{ margin: '16px 0 12px 0' }}>MCREE / BDMRA SEGMENT ANALYSIS</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>SEGMENT</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>DIST</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>W-RISK</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>T-RISK</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>R-RISK</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>OP-RISK</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '4px' }}>DYN COST</th>
            </tr>
          </thead>
          <tbody>
            {rec.segments.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.from} → {s.to}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.distance}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.weatherRisk}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.terrainRisk}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.roadRisk}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.operationalRisk}</td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{s.dynamicCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '10px', color: '#666' }}>
        -- END OF REPORT --
      </div>
    </div>
  );
};
