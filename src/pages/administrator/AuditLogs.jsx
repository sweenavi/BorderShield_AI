import React from 'react';

export const AuditLogs = () => {
  const logs = [
    { id: 'LOG-8842', user: 'rajesh.kumar@bordershield.local', action: 'MISSION_AUTHORIZED', target: 'MSN-8192', timestamp: '2026-09-22T09:12:00Z', status: 'SUCCESS' },
    { id: 'LOG-8841', user: 'vikram.singh@bordershield.local', action: 'MISSION_CREATED', target: 'MSN-8192', timestamp: '2026-09-22T08:45:22Z', status: 'SUCCESS' },
    { id: 'LOG-8840', user: 'SYSTEM', action: 'WEATHER_SYNC_FAILED', target: 'WEATHER_API', timestamp: '2026-09-22T08:00:00Z', status: 'FAILURE' },
    { id: 'LOG-8839', user: 'rajesh.kumar@bordershield.local', action: 'USER_LOGIN', target: 'AUTH_SERVICE', timestamp: '2026-09-22T07:15:00Z', status: 'SUCCESS' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>SECURITY AUDIT LOGS</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>SYSTEM EVENT TRACKING</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>TIMESTAMP (UTC)</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>LOG ID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>ACTOR</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>ACTION</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>TARGET</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>RESULT</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{l.timestamp}</td>
                <td style={{ padding: '12px', color: 'var(--accent-cyan)' }}>{l.id}</td>
                <td style={{ padding: '12px', color: l.user === 'SYSTEM' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{l.user}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{l.action}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{l.target}</td>
                <td style={{ padding: '12px', color: l.status === 'SUCCESS' ? 'var(--status-success)' : 'var(--status-danger)' }}>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
