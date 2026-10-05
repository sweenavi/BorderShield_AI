import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Users, Terminal } from 'lucide-react';
import { OperationalMap } from '../../components/common/OperationalMap';
import { Button } from '../../components/common/Button';
import { missionService } from '../../services/missionService';
import { ROUTES } from '../../app/routes';

export const AdminDashboard = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    setMissions(missionService.getMissions());
  }, []);

  const pending = missions.filter(m => m.status === 'PENDING AUTHORIZATION');
  const active = missions.filter(m => m.status === 'ACTIVE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'PENDING APPROVALS', value: pending.length, icon: ShieldAlert, color: 'var(--status-danger)' },
          { label: 'ACTIVE DEPLOYMENTS', value: active.length, icon: Activity, color: 'var(--status-success)' },
          { label: 'ACTIVE PERSONNEL', value: '142', icon: Users, color: 'var(--accent-cyan)' },
          { label: 'SYSTEM THREATS', value: '0', icon: Terminal, color: 'var(--status-success)' }
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
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '0.05em' }}>SECTOR COMMAND MAP</span>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <OperationalMap showAllEdges={true} />
          </div>
        </div>

        {/* Right: Actions Feed */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ flex: 1, backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--status-danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--status-danger)' }}>ACTION REQUIRED</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pending.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>NO PENDING AUTHORIZATIONS</div>
              ) : (
                pending.map(m => (
                  <div key={m.id} style={{ border: '1px solid var(--status-danger)', padding: '12px', backgroundColor: 'var(--bg-dark-navy)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>{m.id}</span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', border: '1px solid var(--status-danger)', color: 'var(--status-danger)' }}>{m.status}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {m.sourceId} &rarr; {m.destinationId}
                    </div>
                    <Link to={ROUTES.ADMIN.AUTHORIZATION}>
                      <Button variant="danger" style={{ width: '100%', fontSize: '0.65rem', padding: '6px' }}>REVIEW FOR AUTHORIZATION</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
