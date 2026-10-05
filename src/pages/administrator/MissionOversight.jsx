import React, { useState, useEffect } from 'react';
import { missionService } from '../../services/missionService';

export const MissionOversight = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    setMissions(missionService.getMissions());
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>MISSION OVERSIGHT LOG</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>ALL HISTORICAL AND ACTIVE DEPLOYMENTS</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>MISSION ID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>TYPE</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>ROUTE</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>CREATED</th>
            </tr>
          </thead>
          <tbody>
            {missions.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>NO RECORDS FOUND</td></tr>
            ) : (
              missions.slice().reverse().map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{m.id}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '2px 6px', 
                      border: '1px solid', 
                      borderColor: m.status === 'ACTIVE' ? 'var(--status-success)' : m.status === 'PENDING AUTHORIZATION' ? 'var(--status-warning)' : m.status === 'REJECTED' ? 'var(--status-danger)' : 'var(--border-medium)',
                      color: m.status === 'ACTIVE' ? 'var(--status-success)' : m.status === 'PENDING AUTHORIZATION' ? 'var(--status-warning)' : m.status === 'REJECTED' ? 'var(--status-danger)' : 'var(--text-secondary)'
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{m.missionType}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{m.sourceId} &rarr; {m.destinationId}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
