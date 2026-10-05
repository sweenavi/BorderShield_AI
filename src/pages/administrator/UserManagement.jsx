import React from 'react';
import { Users as UsersIcon, UserPlus } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const UserManagement = () => {
  const users = [
    { id: 'USR-001', name: 'Vikram Singh', role: 'MISSION PLANNER', status: 'ACTIVE', lastLogin: '2026-09-22 08:00Z' },
    { id: 'USR-002', name: 'Rajesh Kumar', role: 'ADMINISTRATOR', status: 'ACTIVE', lastLogin: '2026-09-22 09:15Z' },
    { id: 'USR-003', name: 'Anjali Sharma', role: 'MISSION PLANNER', status: 'OFFLINE', lastLogin: '2026-09-21 16:30Z' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>PERSONNEL ROSTER</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>SYSTEM ACCESS MANAGEMENT</p>
        </div>
        <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} /> INVITE PERSONNEL
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>NAME</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>ROLE</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>LAST LOGIN (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px', color: 'var(--accent-cyan)' }}>{u.id}</td>
                <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{u.name}</td>
                <td style={{ padding: '12px', color: u.role === 'ADMINISTRATOR' ? 'var(--status-danger)' : 'var(--text-secondary)' }}>{u.role}</td>
                <td style={{ padding: '12px', color: u.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-muted)' }}>{u.status}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
