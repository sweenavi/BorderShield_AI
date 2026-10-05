import React, { useState } from 'react';
import { roadMaster } from '../../data/roadMaster';
import { nodeMaster } from '../../data/nodeMaster';
import { AlertTriangle, CheckCircle, XCircle, Edit3, MapPin } from 'lucide-react';

const STATUS_STYLE = {
  Open:       { color: 'var(--status-success)', border: 'var(--status-success-border)' },
  Restricted: { color: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  Blocked:    { color: 'var(--status-danger)',   border: 'var(--status-danger-border)' },
};

export const RoadOperations = () => {
  const [roads, setRoads] = useState(roadMaster.slice(0, 30));
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [note, setNote] = useState('');

  const stats = {
    open:       roads.filter(r => r.operationalStatus === 'Open').length,
    restricted: roads.filter(r => r.operationalStatus === 'Restricted').length,
    blocked:    roads.filter(r => r.operationalStatus === 'Blocked').length,
    total:      roads.length,
  };

  const filtered = roads.filter(r =>
    r.id.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.from.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.to.toLowerCase().includes(searchQ.toLowerCase())
  );

  const updateStatus = (roadId, status) => {
    setRoads(prev => prev.map(r => r.id === roadId ? { ...r, operationalStatus: status } : r));
    setSelected(prev => prev?.id === roadId ? { ...prev, operationalStatus: status } : prev);
  };

  const getNodeName = (id) => nodeMaster.find(n => n.id === id)?.name || id;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header + KPIs */}
      <div>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>ROAD OPERATIONS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'OPEN ROADS',   value: stats.open,       color: 'var(--status-success)' },
            { label: 'RESTRICTED',   value: stats.restricted,  color: 'var(--status-warning)' },
            { label: 'BLOCKED',      value: stats.blocked,     color: 'var(--status-danger)' },
            { label: 'TOTAL ROADS',  value: stats.total,       color: 'var(--accent-cyan)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '14px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Road Table */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
            <input
              placeholder="Search road ID, source, destination..."
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--bg-dark-navy)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '520px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
                <tr>
                  {['ROAD ID', 'FROM → TO', 'DIST', 'SURFACE', 'STATUS', 'HAZARD'].map(h => (
                    <th key={h} style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((road, i) => {
                  const s = STATUS_STYLE[road.operationalStatus] || STATUS_STYLE.Open;
                  const isSelected = selected?.id === road.id;
                  return (
                    <tr key={road.id} onClick={() => setSelected(road)}
                      style={{
                        borderBottom: '1px solid var(--border-light)', cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--accent-cyan-dim)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background 0.1s'
                      }}>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{road.id}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-secondary)' }}>{road.from} → {road.to}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{road.distanceKm} km</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{road.surfaceType || '—'}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: s.color, border: `1px solid ${s.border}`, padding: '2px 7px', letterSpacing: '0.06em' }}>
                          {(road.operationalStatus || 'OPEN').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: road.hazard ? 'var(--status-warning)' : 'var(--text-muted)' }}>
                        {road.hazard || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div style={{ width: '260px', flexShrink: 0, backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!selected ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '32px' }}>
              <MapPin size={24} color="var(--text-muted)" style={{ marginBottom: '8px' }} /><br />
              Select a road to view details and update status
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>{selected.id}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {getNodeName(selected.from)} → {getNodeName(selected.to)}
                </div>
              </div>

              {[
                { label: 'DISTANCE',  value: `${selected.distanceKm} km` },
                { label: 'SURFACE',   value: selected.surfaceType || 'Mixed' },
                { label: 'ROAD GRADE',value: selected.grade || '—' },
                { label: 'ELEVATION', value: selected.elevation || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>UPDATE STATUS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Open', 'Restricted', 'Blocked'].map(status => {
                    const s = STATUS_STYLE[status];
                    return (
                      <button key={status} onClick={() => updateStatus(selected.id, status)} style={{
                        padding: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
                        border: `1px solid ${selected.operationalStatus === status ? s.color : 'var(--border-medium)'}`,
                        backgroundColor: selected.operationalStatus === status ? `rgba(0,0,0,0.3)` : 'transparent',
                        color: selected.operationalStatus === status ? s.color : 'var(--text-secondary)',
                        cursor: 'pointer', letterSpacing: '0.06em', transition: 'all 0.15s'
                      }}>MARK {status.toUpperCase()}</button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.1em' }}>FIELD NOTE</div>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Condition details, hazard description..."
                  rows={3}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', backgroundColor: 'var(--bg-dark-navy)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', resize: 'vertical', outline: 'none' }}
                />
                <button style={{ marginTop: '6px', width: '100%', padding: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', backgroundColor: 'var(--accent-cyan-dim)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', letterSpacing: '0.06em' }}
                  onClick={() => { alert(`Note submitted for ${selected.id}: "${note}"`); setNote(''); }}>
                  SUBMIT UPDATE
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
