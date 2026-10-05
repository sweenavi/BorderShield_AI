import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { Button } from '../../components/common/Button';
import { ShieldCheck, XCircle, RotateCcw } from 'lucide-react';

export const MissionAuthorization = () => {
  const [missions, setMissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Only load pending missions
    const all = missionService.getMissions();
    setMissions(all.filter(m => m.status === 'PENDING AUTHORIZATION'));
  }, []);

  const handleAction = (id, newStatus) => {
    missionService.updateMissionStatus(id, newStatus);
    setMissions(missions.filter(m => m.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--status-danger)' }}>COMMAND AUTHORIZATION</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>PENDING MISSION DEPLOYMENTS</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {missions.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-navy)', padding: '24px', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            NO PENDING MISSIONS REQUIRE AUTHORIZATION AT THIS TIME.
          </div>
        ) : (
          missions.map(m => {
            const routeResult = missionService.getRouteResult(m.id);
            const rec = routeResult?.recommended;
            return (
              <div key={m.id} style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>{m.id}</div>
                    <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '4px' }}>{m.missionType} | {m.transportMode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>ROUTE</div>
                    <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '4px' }}>{m.sourceId} &rarr; {m.destinationId}</div>
                  </div>
                </div>

                {rec && (
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>DISTANCE:</span> <strong style={{ color: 'var(--text-primary)' }}>{rec.metrics.totalDistance} km</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>ETA:</span> <strong style={{ color: 'var(--text-primary)' }}>{Math.floor(rec.metrics.totalETA / 60)}h {Math.round(rec.metrics.totalETA % 60)}m</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>RISK:</span> <strong style={{ color: rec.metrics.riskClassification.color }}>{rec.metrics.averageRisk} / 100 ({rec.metrics.riskClassification.label})</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>COST:</span> <strong style={{ color: 'var(--accent-gold)' }}>{rec.metrics.cumulativeCost}</strong></div>
                  </div>
                )}
                
                <div style={{ padding: '16px', display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
                   <div>
                     <Button variant="secondary" onClick={() => navigate(`/admin/missions/${m.id}/route`)}>
                       VIEW ANALYSIS
                     </Button>
                   </div>
                   <div style={{ display: 'flex', gap: '16px' }}>
                     <Button variant="secondary" onClick={() => handleAction(m.id, 'RETURN FOR REVISION')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <RotateCcw size={14} /> RETURN
                     </Button>
                     <Button variant="danger" onClick={() => handleAction(m.id, 'REJECTED')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <XCircle size={14} /> REJECT
                     </Button>
                     <Button variant="primary" onClick={() => handleAction(m.id, 'AUTHORIZED')} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}>
                       <ShieldCheck size={14} /> AUTHORIZE DEPLOYMENT
                     </Button>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
