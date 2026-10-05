import React, { useState } from 'react';
import { Users, Lock, Monitor, Clock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { missionService } from '../../services/missionService';

const USERS = [
  { id: 'PLN-001', name: 'Vikram Singh',    role: 'MISSION PLANNER',  status: 'ACTIVE',   lastLogin: '2026-09-28 08:42' },
  { id: 'PLN-002', name: 'Arjun Kapoor',    role: 'MISSION PLANNER',  status: 'ACTIVE',   lastLogin: '2026-09-28 07:15' },
  { id: 'OPS-001', name: 'Anand Sharma',    role: 'ROAD OPERATIONS',  status: 'ACTIVE',   lastLogin: '2026-09-28 06:30' },
  { id: 'OPS-002', name: 'Suresh Nair',     role: 'ROAD OPERATIONS',  status: 'INACTIVE', lastLogin: '2026-09-25 14:22' },
  { id: 'ADM-001', name: 'Rajesh Kumar',    role: 'ADMINISTRATOR',    status: 'ACTIVE',   lastLogin: '2026-09-28 05:55' },
];

const SESSIONS = [
  { id: 'SES-4F2', user: 'Vikram Singh',  role: 'MISSION PLANNER', device: 'DESKTOP-LEH-01', duration: '2h 14m',  current: true },
  { id: 'SES-7A9', user: 'Anand Sharma',  role: 'ROAD OPERATIONS', device: 'FIELD-UNIT-03',  duration: '45m',     current: false },
  { id: 'SES-1C3', user: 'Rajesh Kumar',  role: 'ADMINISTRATOR',   device: 'ADMIN-WS-01',    duration: '3h 02m',  current: false },
];

const PERMISSIONS = [
  { label: 'Create Mission',    officer: true,  ops: false, admin: true  },
  { label: 'Analyze Route',     officer: true,  ops: 'view',admin: true  },
  { label: 'Update Road Status',officer: false, ops: true,  admin: true  },
  { label: 'Operational Map',   officer: true,  ops: true,  admin: true  },
  { label: 'Environmental Data',officer: true,  ops: true,  admin: true  },
  { label: 'Risk & XAI',        officer: true,  ops: 'view',admin: true  },
  { label: 'Mission History',   officer: true,  ops: 'view',admin: true  },
  { label: 'Reports Center',    officer: true,  ops: 'view',admin: true  },
  { label: 'Notifications',     officer: true,  ops: true,  admin: true  },
  { label: 'Road Operations',   officer: false, ops: true,  admin: true  },
  { label: 'System Diagnostics',officer: false, ops: false, admin: true  },
  { label: 'Master Data',       officer: false, ops: false, admin: true  },
  { label: 'Security & Access', officer: false, ops: false, admin: true  },
];

const PermCell = ({ val }) => {
  if (val === true)   return <td style={{ textAlign: 'center', padding: '9px' }}><CheckCircle size={14} color="var(--status-success)" /></td>;
  if (val === false)  return <td style={{ textAlign: 'center', padding: '9px' }}><XCircle size={14} color="var(--text-muted)" /></td>;
  return <td style={{ textAlign: 'center', padding: '9px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--status-info)' }}>VIEW</td>;
};

const SECTIONS = ['USERS', 'ROLE PERMISSIONS', 'ACTIVE SESSIONS', 'AUDIT LOG'];

export const SecurityAccess = () => {
  const [section, setSection] = useState(0);
  const auditLogs = missionService.getAuditLog().slice(-20).reverse();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>SECURITY & ACCESS CONTROL</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--status-danger)', letterSpacing: '0.1em' }}>
          ⚠ ADMINISTRATOR ONLY
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-light)' }}>
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => setSection(i)} style={{
            padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.06em', border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
            color: section === i ? 'var(--status-danger)' : 'var(--text-muted)',
            borderBottom: section === i ? '2px solid var(--status-danger)' : '2px solid transparent',
            transition: 'all 0.15s', marginBottom: '-1px'
          }}>{s}</button>
        ))}
      </div>

      {/* Section 0: Users */}
      {section === 0 && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['USER ID', 'NAME', 'ROLE', 'STATUS', 'LAST LOGIN', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((u, i) => {
                const roleColor = u.role === 'ADMINISTRATOR' ? 'var(--status-danger)' : u.role === 'ROAD OPERATIONS' ? 'var(--status-warning)' : 'var(--accent-cyan)';
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)' }}>{u.id}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{u.name}</td>
                    <td style={{ padding: '10px 14px' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: roleColor, border: `1px solid ${roleColor}`, padding: '2px 7px' }}>{u.role}</span></td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: u.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-muted)' }}>● {u.status}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>{u.lastLogin}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['RESET', u.status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE'].map(action => (
                          <button key={action} style={{
                            padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem',
                            border: '1px solid var(--border-medium)', backgroundColor: 'transparent',
                            color: action === 'DEACTIVATE' ? 'var(--status-warning)' : 'var(--text-secondary)',
                            cursor: 'pointer', letterSpacing: '0.04em'
                          }}>{action}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Section 1: Role Permissions */}
      {section === 1 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-navy)' }}>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>PERMISSION / MODULE</th>
                {[
                  { label: 'LOGISTICS OFFICER', color: 'var(--accent-cyan)' },
                  { label: 'ROAD OPERATIONS',   color: 'var(--status-warning)' },
                  { label: 'ADMINISTRATOR',     color: 'var(--status-danger)' },
                ].map(({ label, color }) => (
                  <th key={label} style={{ padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color, borderBottom: '1px solid var(--border-medium)', textAlign: 'center', letterSpacing: '0.08em' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p, i) => (
                <tr key={p.label} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)', borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{p.label}</td>
                  <PermCell val={p.officer} />
                  <PermCell val={p.ops} />
                  <PermCell val={p.admin} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section 2: Active Sessions */}
      {section === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SESSIONS.map(s => (
            <div key={s.id} style={{
              backgroundColor: 'var(--bg-navy)', border: `1px solid ${s.current ? 'var(--accent-cyan-border)' : 'var(--border-light)'}`,
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-cyan)' }}>{s.id}</span>
                  {s.current && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)', padding: '1px 6px' }}>CURRENT</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600 }}>{s.user}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.role} · {s.device}
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.duration}</div>
                {!s.current && (
                  <button style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--status-danger)', border: '1px solid var(--status-danger)', background: 'none', padding: '4px 10px', cursor: 'pointer' }}>
                    REVOKE SESSION
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Audit Log */}
      {section === 3 && (
        <div style={{ overflowX: 'auto', maxHeight: '480px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
              <tr>
                {['TIME', 'ACTION', 'DETAIL', 'ROLE', 'RESULT'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>NO AUDIT ENTRIES YET</td></tr>
              )}
              {auditLogs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour12: false })}
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)' }}>{log.action}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.detail}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)' }}>{log.role}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--status-success)' }}>SUCCESS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
