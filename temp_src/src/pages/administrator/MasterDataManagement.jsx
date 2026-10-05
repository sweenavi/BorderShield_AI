import React, { useState } from 'react';
import { nodeMaster, NODE_TYPES } from '../../data/nodeMaster';
import { roadMaster } from '../../data/roadMaster';
import { Database, Map, Cloud, Activity, Clock, AlertTriangle } from 'lucide-react';

const TABS = ['NODES', 'ROADS', 'HAZARDS', 'WEATHER STATIONS', 'HISTORICAL RECORDS', 'MODEL CONFIG'];

const HAZARDS = [
  { id: 'HZ-001', location: 'L11 – L14 Corridor', type: 'Avalanche Zone',    severity: 'HIGH',   active: true,  updated: '2026-09-28' },
  { id: 'HZ-002', location: 'R004 / Pass 4',       type: 'Snow Drift',        severity: 'MEDIUM', active: true,  updated: '2026-09-28' },
  { id: 'HZ-003', location: 'CP06 – J04',          type: 'Ice Formation',     severity: 'LOW',    active: false, updated: '2026-09-27' },
  { id: 'HZ-004', location: 'L18 / OP Alpha',      type: 'Extreme Cold',      severity: 'HIGH',   active: true,  updated: '2026-09-28' },
];

const WX_STATIONS = [
  { id: 'WS-01', loc: 'Leh Base',    elev: '3524 m', source: 'IMD',      status: 'ONLINE' },
  { id: 'WS-02', loc: 'Khardung',    elev: '5359 m', source: 'IMD',      status: 'ONLINE' },
  { id: 'WS-03', loc: 'Siachen',     elev: '4486 m', source: 'SYNTHETIC',status: 'ONLINE' },
  { id: 'WS-04', loc: 'Nubra',       elev: '3186 m', source: 'SYNTHETIC',status: 'ONLINE' },
  { id: 'WS-05', loc: 'DBO',         elev: '5428 m', source: 'SYNTHETIC',status: 'DEGRADED' },
];

const HIST = [
  { id: 'HR-001', road: 'R004', event: 'Road Closure', date: '2026-02-12', severity: 'HIGH',   duration: '6 days' },
  { id: 'HR-002', road: 'R011', event: 'Avalanche',    date: '2026-01-25', severity: 'CRITICAL', duration: '14 days' },
  { id: 'HR-003', road: 'R007', event: 'Snow Drift',   date: '2025-12-30', severity: 'MEDIUM', duration: '2 days' },
  { id: 'HR-004', road: 'R001', event: 'Ice Formation',date: '2025-11-18', severity: 'LOW',    duration: '1 day' },
];

const MODEL_CONFIG = [
  { param: 'Model Type',         value: 'Random Forest' },
  { param: 'Version',            value: '1.0.2' },
  { param: 'Feature Count',      value: '18' },
  { param: 'Training Date',      value: '2026-07-15' },
  { param: 'Accuracy',           value: '94.2%' },
  { param: 'Weather Weight',     value: '0.35 (35%)' },
  { param: 'Terrain Weight',     value: '0.30 (30%)' },
  { param: 'Road Weight',        value: '0.20 (20%)' },
  { param: 'Historical Weight',  value: '0.15 (15%)' },
  { param: 'Status',             value: 'PRODUCTION' },
];

const TH = ({ children }) => (
  <th style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{children}</th>
);
const TD = ({ children, style }) => (
  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', ...style }}>{children}</td>
);

export const MasterDataManagement = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [nodeTypeFilter, setNodeTypeFilter] = useState('ALL');

  const filteredNodes = nodeMaster.filter(n => {
    if (!n.y && !n.x) return false;
    if (nodeTypeFilter !== 'ALL' && n.type !== nodeTypeFilter) return false;
    if (search) return n.id.toLowerCase().includes(search.toLowerCase()) || n.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredRoads = roadMaster.filter(r => {
    if (!search) return true;
    return r.id.toLowerCase().includes(search.toLowerCase()) || r.from.toLowerCase().includes(search.toLowerCase()) || r.to.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>MASTER DATA MANAGEMENT</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--status-danger)', letterSpacing: '0.1em' }}>
          ⚠ ADMINISTRATOR ONLY — MODIFICATION REQUIRES AUDIT ENTRY
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-light)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setSearch(''); }} style={{
            padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.06em', border: 'none', cursor: 'pointer',
            backgroundColor: 'transparent',
            color: tab === i ? 'var(--accent-cyan)' : 'var(--text-muted)',
            borderBottom: tab === i ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            transition: 'all 0.15s', marginBottom: '-1px'
          }}>{t}</button>
        ))}
      </div>

      {/* Search bar (shared) */}
      {tab <= 1 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input placeholder={`Search ${TABS[tab]}...`} value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: '360px', padding: '8px 14px', backgroundColor: 'var(--bg-dark-navy)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }} />
          {tab === 0 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'L', 'CP', 'HP', 'RP', 'OT', 'BR', 'J'].map(t => (
                <button key={t} onClick={() => setNodeTypeFilter(t)} style={{
                  padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem',
                  border: '1px solid var(--border-light)',
                  backgroundColor: nodeTypeFilter === t ? 'var(--accent-cyan-dim)' : 'transparent',
                  color: nodeTypeFilter === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}>{t}</button>
              ))}
            </div>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            FROZEN DATASET — {tab === 0 ? filteredNodes.length : filteredRoads.length} records
          </span>
        </div>
      )}

      {/* TAB 0: Nodes */}
      {tab === 0 && (
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
              <tr><TH>NODE ID</TH><TH>NAME</TH><TH>TYPE</TH><TH>ELEVATION (m)</TH><TH>LAT</TH><TH>LNG</TH><TH>MAP Y</TH><TH>MAP X</TH></tr>
            </thead>
            <tbody>
              {filteredNodes.slice(0, 60).map((n, i) => {
                const typeStyle = NODE_TYPES[n.type];
                return (
                  <tr key={n.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                    <TD style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{n.id}</TD>
                    <TD>{n.name}</TD>
                    <TD><span style={{ color: typeStyle?.color || 'var(--text-muted)', fontSize: '0.5875rem', border: '1px solid', borderColor: typeStyle?.color || 'var(--border-medium)', padding: '1px 6px' }}>{n.type}</span></TD>
                    <TD style={{ color: 'var(--text-secondary)' }}>{n.elevation || '—'}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{n.lat || '—'}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{n.lng || '—'}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{n.y}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{n.x}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 1: Roads */}
      {tab === 1 && (
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
              <tr><TH>ROAD ID</TH><TH>FROM</TH><TH>TO</TH><TH>DIST (km)</TH><TH>SURFACE</TH><TH>ROAD TYPE</TH><TH>STATUS</TH></tr>
            </thead>
            <tbody>
              {filteredRoads.slice(0, 50).map((r, i) => {
                const sc = { Open: 'var(--status-success)', Restricted: 'var(--status-warning)', Blocked: 'var(--status-danger)' };
                return (
                  <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                    <TD style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{r.id}</TD>
                    <TD style={{ color: 'var(--text-secondary)' }}>{r.from}</TD>
                    <TD style={{ color: 'var(--text-secondary)' }}>{r.to}</TD>
                    <TD style={{ fontWeight: 600 }}>{r.distanceKm}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{r.surfaceType || '—'}</TD>
                    <TD style={{ color: 'var(--text-muted)' }}>{r.roadType || '—'}</TD>
                    <TD><span style={{ fontSize: '0.5875rem', color: sc[r.operationalStatus] || 'var(--text-muted)', border: `1px solid ${sc[r.operationalStatus] || 'var(--border-medium)'}`, padding: '1px 6px' }}>{(r.operationalStatus || 'OPEN').toUpperCase()}</span></TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Hazards */}
      {tab === 2 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><TH>HAZARD ID</TH><TH>LOCATION</TH><TH>TYPE</TH><TH>SEVERITY</TH><TH>ACTIVE</TH><TH>LAST UPDATED</TH></tr></thead>
          <tbody>
            {HAZARDS.map((h, i) => {
              const sc = { CRITICAL: 'var(--status-danger)', HIGH: 'var(--status-danger)', MEDIUM: 'var(--status-warning)', LOW: 'var(--accent-cyan)' };
              return (
                <tr key={h.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                  <TD style={{ color: 'var(--accent-cyan)' }}>{h.id}</TD>
                  <TD>{h.location}</TD>
                  <TD style={{ color: 'var(--text-secondary)' }}>{h.type}</TD>
                  <TD><span style={{ color: sc[h.severity], border: `1px solid ${sc[h.severity]}`, padding: '1px 6px', fontSize: '0.5875rem' }}>{h.severity}</span></TD>
                  <TD style={{ color: h.active ? 'var(--status-danger)' : 'var(--text-muted)' }}>{h.active ? '● ACTIVE' : '○ RESOLVED'}</TD>
                  <TD style={{ color: 'var(--text-muted)' }}>{h.updated}</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* TAB 3: Weather Stations */}
      {tab === 3 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><TH>STATION ID</TH><TH>LOCATION</TH><TH>ELEVATION</TH><TH>DATA SOURCE</TH><TH>STATUS</TH></tr></thead>
          <tbody>
            {WX_STATIONS.map((ws, i) => (
              <tr key={ws.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                <TD style={{ color: 'var(--accent-cyan)' }}>{ws.id}</TD>
                <TD>{ws.loc}</TD>
                <TD style={{ color: 'var(--text-secondary)' }}>{ws.elev}</TD>
                <TD style={{ color: 'var(--text-muted)' }}>{ws.source}</TD>
                <TD style={{ color: ws.status === 'ONLINE' ? 'var(--status-success)' : 'var(--status-warning)' }}>● {ws.status}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* TAB 4: Historical Records */}
      {tab === 4 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><TH>RECORD ID</TH><TH>ROAD</TH><TH>EVENT</TH><TH>DATE</TH><TH>SEVERITY</TH><TH>DURATION</TH></tr></thead>
          <tbody>
            {HIST.map((h, i) => {
              const sc = { CRITICAL: 'var(--status-danger)', HIGH: 'var(--status-danger)', MEDIUM: 'var(--status-warning)', LOW: 'var(--accent-cyan)' };
              return (
                <tr key={h.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                  <TD style={{ color: 'var(--accent-cyan)' }}>{h.id}</TD>
                  <TD style={{ color: 'var(--text-secondary)' }}>{h.road}</TD>
                  <TD>{h.event}</TD>
                  <TD style={{ color: 'var(--text-muted)' }}>{h.date}</TD>
                  <TD><span style={{ color: sc[h.severity], border: `1px solid ${sc[h.severity]}`, padding: '1px 6px', fontSize: '0.5875rem' }}>{h.severity}</span></TD>
                  <TD style={{ color: 'var(--text-muted)' }}>{h.duration}</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* TAB 5: Model Config */}
      {tab === 5 && (
        <div style={{ maxWidth: '540px', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>MCREE MODEL CONFIGURATION — READ ONLY IN PRODUCTION</div>
          {MODEL_CONFIG.map(({ param, value }, i) => (
            <div key={param} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{param}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
