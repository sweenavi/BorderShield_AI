import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Cloud, AlertTriangle, Eye, FileText, Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { label: 'Command Dashboard',    icon: LayoutDashboard, path: '/ops/dashboard' },
      { label: 'Operational Map',      icon: Map,             path: '/ops/map' },
    ]
  },
  {
    label: 'MONITORING',
    items: [
      { label: 'Environmental Conditions', icon: Cloud,         path: '/ops/environmental' },
      { label: 'Route Analysis',           icon: Eye,           path: '/ops/route-analysis' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Road Operations', icon: AlertTriangle, path: '/ops/road-operations' },
    ]
  },
  {
    label: 'RECORDS',
    items: [
      { label: 'Mission History', icon: Eye,       path: '/ops/missions' },
      { label: 'Reports Center',  icon: FileText,  path: '/ops/reports' },
      { label: 'Notifications',   icon: Bell,      path: '/ops/notifications' },
    ]
  }
];

const isPathActive = (location, path) => location.pathname.startsWith(path);

export const OpsLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark-navy)' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', flexShrink: 0, backgroundColor: 'var(--bg-navy)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="var(--accent-cyan)" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>BORDERSHIELD AI</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--accent-cyan)', letterSpacing: '0.12em', marginTop: '6px', marginLeft: '28px' }}>TACTICAL ROUTE DECISION SUPPORT</div>
        </div>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--status-warning)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            ROAD OPERATIONS TEAM
          </span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: '4px' }}>
              <div style={{ padding: '8px 20px 4px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>{group.label}</div>
              {group.items.map(item => {
                const active = isPathActive(location, item.path);
                return (
                  <Link key={item.path} to={item.path} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 20px',
                    color: active ? 'var(--status-warning)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'var(--status-warning-dim)' : 'transparent',
                    borderLeft: active ? '2px solid var(--status-warning)' : '2px solid transparent',
                    textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    fontWeight: active ? 600 : 400, transition: 'all 0.15s', letterSpacing: '0.02em'
                  }}>
                    <item.icon size={14} strokeWidth={active ? 2.5 : 1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)' }}>
          <button onClick={() => { logout(); navigate('/auth/login'); }} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', width: '100%',
            background: 'none', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.08em', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--status-danger)'; e.currentTarget.style.borderColor = 'var(--status-danger)'; e.currentTarget.style.backgroundColor = 'var(--status-danger-dim)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={13} /> TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <header style={{ height: '48px', flexShrink: 0, backgroundColor: 'var(--bg-navy)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--status-warning)', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', backgroundColor: 'var(--status-warning)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            ROAD OPERATIONS SESSION
          </span>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)' }}>UTC {new Date().toISOString().substring(11, 19)} Z</div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-dark-navy)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
