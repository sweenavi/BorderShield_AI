import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService, classifyRisk } from '../../services/routingService';
import { nodeMaster } from '../../data/nodeMaster';
import { OperationalMap } from '../../components/common/OperationalMap';
import { Printer } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const MissionReport = () => {
  const { missionId } = useParams();
  const mission = missionService.getMissionById(missionId);

  // Read STORED route result — never recalculate independently
  let routeResult = missionService.getRouteResult(missionId);

  if (!mission || !routeResult) return <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>REPORT DATA UNAVAILABLE</div>;

  const rec = routeResult.recommended;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @media print {
          .no-print, .layout-sidebar, .layout-header { display: none !important; }
          body, .layout-main, main { background: white !important; overflow: visible !important; height: auto !important; }
          .report-container { max-width: 100% !important; margin: 0 !important; padding: 20px !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print" style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000', color: '#fff', borderColor: '#000' }}>
          <Printer size={16} /> PRINT / DOWNLOAD PDF
        </Button>
      </div>

      <div className="report-container" style={{ backgroundColor: '#fff', color: '#000', padding: '48px', fontFamily: 'serif', maxWidth: '850px', margin: '0 auto', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src="/logo.png" alt="BorderShield AI Logo" style={{ height: '32px', width: 'auto', filter: 'invert(1) grayscale(1) contrast(100)' }} />
            <h1 style={{ margin: 0, fontSize: '24px' }}>BORDERSHIELD AI</h1>
          </div>
          <h2 style={{ margin: '8px 0', fontSize: '18px' }}>AFTER-ACTION MISSION REPORT</h2>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>DOC ID: {missionId} | GENERATED: {new Date().toUTCString()}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
          <div>
            <strong>MISSION PARAMETERS</strong><br/>
            Type: {mission.missionType}<br/>
            Vehicle: {mission.vehicleType}<br/>
            Vehicle Count: {mission.vehicleCount}<br/>
            Priority: {mission.priority}<br/>
            Status: {mission.status}<br/>
          </div>
          <div>
            <strong>ROUTING SUMMARY</strong><br/>
            Source: {mission.sourceId} — {nodeMaster.find(n => n.id === mission.sourceId)?.name}<br/>
            Dest: {mission.destinationId} — {nodeMaster.find(n => n.id === mission.destinationId)?.name}<br/>
            Distance: {rec.metrics.totalDistance} km<br/>
            ETA: {Math.floor(rec.metrics.totalETA / 60)}h {Math.round(rec.metrics.totalETA % 60)}m<br/>
            MCREE Risk: {rec.metrics.averageRisk} / 100<br/>
            Classification: {rec.metrics.riskClassification.label}<br/>
          </div>
        </div>

        <div style={{ border: '2px solid #000', padding: '4px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderBottom: '2px solid #000', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold' }}>
            OPERATIONAL MAP HIGHLIGHT
          </div>
          <div style={{ height: '400px', position: 'relative' }}>
            <OperationalMap 
              routeSegments={rec.segments} 
              highlightNodes={[mission.sourceId, mission.destinationId]}
              interactive={false}
              showAllEdges={false}
            />
          </div>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>DIJKSTRA ROUTE PATH (PRIMARY)</h3>
          <div style={{ fontSize: '14px', marginBottom: '24px', lineHeight: '1.8' }}>
            {rec.path.join(' → ')}
          </div>
          
          <h3 style={{ margin: '16px 0 12px 0', fontSize: '16px' }}>MCREE / BDMRA SEGMENT ANALYSIS</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>SEGMENT</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>DIST</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>W-RISK</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>T-RISK</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>R-RISK</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>OP-RISK</th>
                <th style={{ borderBottom: '2px solid #666', padding: '8px 4px' }}>COST</th>
              </tr>
            </thead>
            <tbody>
              {rec.segments.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.from} → {s.to}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.distance}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.weatherRisk}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.terrainRisk}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.roadRisk}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{s.operationalRisk}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{s.dynamicCost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {routeResult.alternatives && routeResult.alternatives.length > 0 && (
            <>
              <h3 style={{ margin: '32px 0 12px 0', fontSize: '16px', borderTop: '2px solid #ccc', paddingTop: '16px' }}>ALTERNATIVE ROUTES</h3>
              {routeResult.alternatives.map((alt, idx) => (
                <div key={alt.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>ALT {idx + 1}: {alt.metrics.riskClassification.label} RISK</div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ marginRight: '16px' }}>Dist: {alt.metrics.totalDistance} km</span>
                    <span style={{ marginRight: '16px' }}>ETA: {Math.floor(alt.metrics.totalETA / 60)}h {Math.round(alt.metrics.totalETA % 60)}m</span>
                    <span style={{ marginRight: '16px' }}>Risk: {alt.metrics.averageRisk}/100</span>
                    <span>Cost: {alt.metrics.cumulativeCost}</span>
                  </div>
                  <div style={{ color: '#555' }}>
                    Path: {alt.path.join(' → ')}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', fontFamily: 'monospace' }}>
          <div style={{ textAlign: 'center', width: '250px' }}>
            <div style={{ borderBottom: '1px solid #000', height: '40px' }}></div>
            <div style={{ paddingTop: '8px' }}>AUTHORIZED BY</div>
          </div>
          <div style={{ textAlign: 'center', width: '250px' }}>
            <div style={{ borderBottom: '1px solid #000', height: '40px' }}></div>
            <div style={{ paddingTop: '8px' }}>DATE</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '10px', color: '#666' }}>
          -- END OF REPORT --
        </div>
      </div>
    </div>
  );
};
