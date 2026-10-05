import React from 'react';
import { Activity, Database, Cloud, Network, Server } from 'lucide-react';

export const SystemStatus = () => {
  const subsystems = [
    { name: 'FRONTEND APPLICATION', status: 'OPERATIONAL', latency: '2ms', icon: Activity },
    { name: 'LOCAL STORAGE', status: 'OPERATIONAL', latency: '1ms', icon: Database },
    { name: 'LOCAL MOCK DATA', status: 'OPERATIONAL', latency: '0ms', icon: Database },
    { name: 'MCREE ENGINE', status: 'LOCAL PROTOTYPE', latency: '15ms', icon: Network },
    { name: 'BDMRA ROUTING', status: 'LOCAL PROTOTYPE', latency: '20ms', icon: Network },
    { name: 'DIJKSTRA', status: 'LOCAL PROTOTYPE', latency: '12ms', icon: Network },
    { name: 'FASTAPI', status: 'NOT CONNECTED', latency: '-', icon: Server },
    { name: 'SUPABASE', status: 'NOT CONNECTED', latency: '-', icon: Database },
    { name: 'LIVE WEATHER API', status: 'NOT CONNECTED', latency: '-', icon: Cloud }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>SYSTEM DIAGNOSTICS</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>CORE PLATFORM TELEMETRY</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {subsystems.map((sys, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <sys.icon size={20} color="var(--accent-gold)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 'bold' }}>{sys.name}</span>
              </div>
              <div style={{ width: '8px', height: '8px', backgroundColor: sys.status === 'OPERATIONAL' || sys.status === 'LOCAL PROTOTYPE' ? 'var(--status-success)' : 'var(--status-danger)', animation: sys.status === 'OPERATIONAL' ? 'none' : 'pulse 2s infinite' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>STATUS</span>
              <span style={{ color: sys.status === 'OPERATIONAL' || sys.status === 'LOCAL PROTOTYPE' ? 'var(--status-success)' : 'var(--status-danger)' }}>{sys.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>LATENCY</span>
              <span style={{ color: 'var(--text-primary)' }}>{sys.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
