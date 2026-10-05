import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, MapPin, Activity, Cloud, X } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 'N001', type: 'CRITICAL', category: 'WEATHER',  icon: Cloud,         time: '12 min ago', title: 'AVALANCHE RISK — L11 CORRIDOR',        body: 'Visibility dropped below operational threshold (< 1 km). L11 → CP06 corridor affected. Recommend hold on convoy movement.' },
  { id: 'N002', type: 'CRITICAL', category: 'ROAD',     icon: AlertTriangle,  time: '28 min ago', title: 'ROAD BLOCKED — R004 / PASS 4',          body: 'Status changed: OPEN → BLOCKED. Snow drift reported by Road Operations Team. Alternative via R007 available.' },
  { id: 'N003', type: 'WARNING',  category: 'MISSION',  icon: Activity,       time: '1h 04m ago', title: 'ROUTE ANALYSIS COMPLETE — MSN-3066',    body: 'Route analysis for CP03 → L11 completed. XAI explanation available. Awaiting officer review and approval.' },
  { id: 'N004', type: 'WARNING',  category: 'WEATHER',  icon: Cloud,         time: '1h 22m ago', title: 'WIND SPEED THRESHOLD EXCEEDED',         body: 'Wind speed at WS-02 Khardung Pass: 74 km/h. Helicopter operations suspended. Convoy advisories in effect.' },
  { id: 'N005', type: 'INFO',     category: 'ROAD',     icon: MapPin,         time: '2h 10m ago', title: 'ROAD REOPENED — R011',                  body: 'Road R011 status updated: BLOCKED → OPEN. Clearance operation completed. Normal operations may resume.' },
  { id: 'N006', type: 'INFO',     category: 'SYSTEM',   icon: Info,           time: '3h 33m ago', title: 'MCREE ALGORITHM UPDATE',              body: 'MCREE updated to AHP Weights v2.0 (50/30/20).' },
  { id: 'N007', type: 'INFO',     category: 'MISSION',  icon: Activity,       time: '4h 12m ago', title: 'MISSION REPORT GENERATED — MSN-2846',  body: 'After-action report for MSN-2846 is ready for download. Mission completed with Route B, Risk: 18%.' },
  { id: 'N008', type: 'WARNING',  category: 'WEATHER',  icon: Cloud,         time: '5h 05m ago', title: 'TEMPERATURE DROP — SECTOR NORTH',       body: 'Temperature at L18 OP Alpha: -18°C. Below convoy movement threshold (-15°C min). Operational hold recommended.' },
];

const TYPE_STYLES = {
  CRITICAL: { color: 'var(--status-danger)',  bgColor: 'var(--status-danger-dim)',  borderColor: 'var(--status-danger-border)',  icon: AlertCircle },
  WARNING:  { color: 'var(--status-warning)', bgColor: 'var(--status-warning-dim)', borderColor: 'var(--status-warning-border)', icon: AlertTriangle },
  INFO:     { color: 'var(--status-info)',    bgColor: 'var(--status-info-dim, rgba(96,165,250,0.1))', borderColor: 'rgba(96,165,250,0.3)', icon: Info },
};

const FILTERS = ['ALL', 'CRITICAL', 'WARNING', 'INFO', 'WEATHER', 'ROAD', 'MISSION', 'SYSTEM'];

export const Notifications = () => {
  const [filter, setFilter] = useState('ALL');
  const [dismissed, setDismissed] = useState(new Set());

  const visible = NOTIFICATIONS.filter(n => {
    if (dismissed.has(n.id)) return false;
    if (filter === 'ALL') return true;
    return n.type === filter || n.category === filter;
  });

  const counts = {
    CRITICAL: NOTIFICATIONS.filter(n => n.type === 'CRITICAL').length,
    WARNING:  NOTIFICATIONS.filter(n => n.type === 'WARNING').length,
    INFO:     NOTIFICATIONS.filter(n => n.type === 'INFO').length,
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>NOTIFICATIONS & ALERTS</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginTop: '4px' }}>OPERATIONAL ALERT CENTER</div>
        </div>
        <button onClick={() => setDismissed(new Set(NOTIFICATIONS.map(n => n.id)))}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border-medium)', padding: '6px 12px', cursor: 'pointer', letterSpacing: '0.06em' }}>
          MARK ALL READ
        </button>
      </div>

      {/* Summary + Filter Row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Summary cards */}
        {Object.entries(counts).map(([type, count]) => {
          const s = TYPE_STYLES[type];
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: s.bgColor, border: `1px solid ${s.borderColor}`, cursor: 'pointer' }}
              onClick={() => setFilter(f => f === type ? 'ALL' : type)}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: s.color }}>{count}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: s.color, letterSpacing: '0.08em' }}>{type}</span>
            </div>
          );
        })}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem',
              letterSpacing: '0.08em', border: '1px solid var(--border-light)',
              backgroundColor: filter === f ? 'var(--accent-cyan-dim)' : 'transparent',
              color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.15s'
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {visible.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)' }}>
            NO NOTIFICATIONS MATCHING FILTER
          </div>
        )}
        {visible.map(n => {
          const s = TYPE_STYLES[n.type];
          const TypeIcon = s.icon;
          return (
            <div key={n.id} style={{
              backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)',
              borderLeft: `3px solid ${s.color}`, padding: '16px 20px',
              display: 'flex', gap: '16px', position: 'relative',
              animation: 'slideIn 0.2s ease'
            }}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                <TypeIcon size={16} color={s.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: s.color, letterSpacing: '0.1em', marginRight: '8px' }}>{n.type}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', border: '1px solid var(--border-light)', padding: '1px 6px' }}>{n.category}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{n.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.body}</div>
              </div>
              <button onClick={() => setDismissed(d => new Set([...d, n.id]))} style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px'
              }}>
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
