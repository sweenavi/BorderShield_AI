import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Terminal, Activity, FileText,
  ShieldAlert, Eye, Database, Bell, LogOut, Shield,
  Map, PlusSquare, Cloud, AlertTriangle, Lock
} from 'lucide-react';
import { ROUTES } from '../../app/routes';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { label: 'Admin Dashboard',   icon: LayoutDashboard, path: ROUTES.ADMIN.DASHBOARD },
      { label: 'Operational Map',   icon: Map,             path: '/admin/map' },
    ]
  },
  {
    label: 'MISSION PLANNING',
    items: [
      { label: 'Mission Planning',     icon: PlusSquare, path: '/admin/missions/create' },
      { label: 'Route Analysis & XAI', icon: Eye,        path: '/admin/route-analysis' },
    ]
  },
  {
    label: 'ANALYSIS',
    items: [
      { label: 'Environmental Conditions', icon: Cloud,       path: '/admin/environmental' },
      { label: 'Risk Analysis & XAI',      icon: ShieldAlert, path: '/admin/risk-analysis' },
    ]
  },
  {
    label: 'RECORDS',
    items: [
      { label: 'Mission History', icon: Eye,      path: '/admin/missions' },
      { label: 'Reports Center',  icon: FileText, path: ROUTES.ADMIN.REPORTS },
      { label: 'Notifications',   icon: Bell,     path: '/admin/notifications' },
    ]
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Road Operations',     icon: AlertTriangle, path: '/admin/road-operations' },
      { label: 'System Diagnostics',  icon: Activity,      path: ROUTES.ADMIN.SYSTEM_STATUS },
      { label: 'Master Data',         icon: Database,      path: '/admin/master-data' },
      { label: 'Map Calibration',     icon: Map,           path: '/admin/map-calibration' },
      { label: 'Security & Access',   icon: Lock,          path: '/admin/security-access' },
    ]
  }
];

const isPathActive = (location, path) => location.pathname.startsWith(path);

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark-navy)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div style={{
        width: '260px', flexShrink: 0,
        backgroundColor: 'var(--bg-navy)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Wordmark */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="var(--accent-cyan)" strokeWidth={2} />
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700,
              fontSize: '0.9375rem', letterSpacing: '0.04em',
              color: 'var(--text-primary)'
            }}>
              BORDERSHIELD AI
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
            color: 'var(--accent-cyan)', letterSpacing: '0.12em',
            marginTop: '6px', marginLeft: '28px'
          }}>
            TACTICAL ROUTE DECISION SUPPORT
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
            letterSpacing: '0.12em', color: 'var(--status-danger)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              backgroundColor: 'var(--status-danger)', borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            SYSTEM ADMINISTRATOR
          </span>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: '4px' }}>
              <div style={{
                padding: '8px 20px 4px',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.14em', color: 'var(--text-muted)',
              }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const active = isPathActive(location, item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 20px',
                      color: active ? 'var(--status-danger)' : 'var(--text-secondary)',
                      backgroundColor: active ? 'var(--status-danger-dim)' : 'transparent',
                      borderLeft: active ? '2px solid var(--status-danger)' : '2px solid transparent',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s', letterSpacing: '0.02em'
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <item.icon size={14} strokeWidth={active ? 2.5 : 1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', width: '100%',
              background: 'none', border: '1px solid var(--status-danger)',
              color: 'var(--status-danger)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
              letterSpacing: '0.08em', transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--status-danger-dim)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={13} />
            TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <header style={{
          height: '48px', flexShrink: 0,
          backgroundColor: 'var(--bg-navy)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--status-danger)', fontSize: '0.625rem',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.12em',
            border: '1px solid var(--status-danger-border)',
            backgroundColor: 'var(--status-danger-dim)',
            padding: '4px 10px'
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              backgroundColor: 'var(--status-danger)', borderRadius: '50%',
              animation: 'pulse 1.5s infinite'
            }} />
            ADMINISTRATOR SESSION
          </div>
          <div style={{
            color: 'var(--text-muted)', fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.06em'
          }}>
            UTC {new Date().toISOString().substring(11, 19)} Z
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-dark-navy)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
