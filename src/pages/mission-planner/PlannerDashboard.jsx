import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, Activity, ShieldAlert, Crosshair } from 'lucide-react';
import { OperationalMap } from '../../components/common/OperationalMap';
import { Button } from '../../components/common/Button';
import { missionService } from '../../services/missionService';
import { ROUTES } from '../../app/routes';

export const PlannerDashboard = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    setMissions(missionService.getMissions());
  }, []);

  const activeMissions = missions.filter(m => m.status === 'ACTIVE');
  const pendingMissions = missions.filter(m => m.status === 'PENDING AUTHORIZATION');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'ACTIVE MISSIONS', value: activeMissions.length, icon: Activity, color: 'var(--status-success)' },
          { label: 'PENDING APPROVAL', value: pendingMissions.length, icon: ShieldAlert, color: 'var(--status-warning)' },
          { label: 'SECTOR THREAT LEVEL', value: 'ELEVATED', icon: Crosshair, color: 'var(--status-warning)' },
          { label: 'OPERATIONAL READINESS', value: '94%', icon: Map, color: 'var(--accent-cyan)' }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
              <stat.icon size={16} color={stat.color} />
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: '700', marginTop: '12px', fontFamily: 'var(--font-sans)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Split View */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '500px' }}>
        
        {/* Left: Map */}
        <div style={{ flex: '2', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '0.05em' }}>SECTOR TACTICAL MAP</span>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--status-success)' }} />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <OperationalMap showAllEdges={true} />
          </div>
        </div>

        {/* Right: Mission Feed */}
        <div style={{ flex: '1', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '0.05em' }}>MISSION FEED</span>
            <Link to={ROUTES.PLANNER.CREATE_MISSION}>
              <Button variant="primary" style={{ padding: '4px 8px', fontSize: '0.65rem' }}>NEW MISSION</Button>
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {missions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>NO ACTIVE MISSIONS IN SECTOR</div>
            ) : (
              missions.slice().reverse().map(m => (
                <div key={m.id} style={{ border: '1px solid var(--border-medium)', padding: '12px', backgroundColor: 'var(--bg-dark-navy)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{m.id}</span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', border: '1px solid var(--border-medium)', color: m.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-secondary)' }}>{m.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {m.sourceId} &rarr; {m.destinationId}
                  </div>
                  <Link to={ROUTES.PLANNER.MISSION_DETAILS.replace(':missionId', m.id)}>
                    <Button variant="secondary" style={{ width: '100%', fontSize: '0.65rem', padding: '6px' }}>VIEW INTEL</Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
