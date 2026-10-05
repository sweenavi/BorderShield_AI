import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { OperationalMap } from '../../components/common/OperationalMap';

export const MissionMonitoring = () => {
  const { missionId } = useParams();
  const mission = missionService.getMissionById(missionId);
  const [routeResult, setRouteResult] = useState(null);

  useEffect(() => {
    if (mission) {
      // Read STORED authoritative result — never recalculate independently
      let stored = missionService.getRouteResult(missionId);
      setRouteResult(stored);
    }
  }, [mission, missionId]);

  if (!mission) return <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>MISSION NOT FOUND</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>MISSION TELEMETRY: {missionId}</h1>
          <div style={{ color: mission.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--status-warning)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px', fontWeight: 'bold' }}>
            STATUS: {mission.status}
          </div>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: 'var(--status-danger-dim)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold' }}>
          ⚠ LOCAL PROTOTYPE / NO LIVE TELEMETRY
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
        <div style={{ flex: '2', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>LIVE TRACKING</div>
          <div style={{ flex: 1, position: 'relative' }}>
             {routeResult && routeResult.recommended && (
               <OperationalMap 
                 routeSegments={routeResult.recommended.segments} 
                 highlightNodes={[mission.sourceId]}
                 showAllEdges={false}
               />
             )}
          </div>
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px' }}>CURRENT LOCATION</div>
              <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{mission.sourceId}</div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '4px' }}>STATIC - AWAITING DEPARTURE</div>
           </div>
           
           <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px' }}>EVENT LOG</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                 <div style={{ color: 'var(--text-secondary)' }}>[ {new Date(mission.createdAt).toISOString().substring(11,19)} ] MISSION CREATED</div>
                 {mission.status === 'ACTIVE' && <div style={{ color: 'var(--status-success)' }}>[ {new Date().toISOString().substring(11,19)} ] LOGISTICS MOVEMENT INITIATED</div>}
                 {mission.status === 'PENDING AUTHORIZATION' && <div style={{ color: 'var(--status-warning)' }}>[ {new Date().toISOString().substring(11,19)} ] WAITING FOR ADMINISTRATIVE ACTION</div>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
