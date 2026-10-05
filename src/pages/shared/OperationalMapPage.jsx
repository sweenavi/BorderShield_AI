import React, { useState } from 'react';
import { OperationalMap } from '../../components/common/OperationalMap';
import { nodeMaster, NODE_TYPES } from '../../data/nodeMaster';
import { roadMaster } from '../../data/roadMaster';
import { Layers, MapPin, Download } from 'lucide-react';

const LayerToggle = ({ label, checked, onChange, color }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: checked ? 'var(--text-primary)' : 'var(--text-muted)',
    padding: '4px 0', userSelect: 'none'
  }}>
    <input type="checkbox" checked={checked} onChange={onChange}
      style={{ accentColor: color || 'var(--accent-cyan)', width: '13px', height: '13px' }} />
    {label}
  </label>
);

export const OperationalMapPage = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [layers, setLayers] = useState({
    locations: true, checkpoints: true, restPoints: true,
    helipads: true, roads: true, junctions: false,
  });

  const toggle = key => setLayers(p => ({ ...p, [key]: !p[key] }));

  const nodeStats = {
    L:  nodeMaster.filter(n => n.type === 'L').length,
    CP: nodeMaster.filter(n => n.type === 'CP').length,
    HP: nodeMaster.filter(n => n.type === 'HP').length,
    RP: nodeMaster.filter(n => n.type === 'RP').length,
  };

  const roadStats = {
    open:       roadMaster.filter(r => r.operationalStatus === 'Open').length,
    restricted: roadMaster.filter(r => r.operationalStatus === 'Restricted').length,
    blocked:    roadMaster.filter(r => r.operationalStatus === 'Blocked').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', gap: 0 }}>

      {/* ── Top Toolbar ─────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-navy)', borderBottom: '1px solid var(--border-light)',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>
            OPERATIONAL MAP
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginTop: '3px' }}>
            LEH–LADAKH–SIACHEN SECTOR — TACTICAL OVERVIEW
          </div>
        </div>

        {/* Road status KPIs */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'OPEN ROADS',   value: roadStats.open,       color: 'var(--status-success)' },
            { label: 'RESTRICTED',   value: roadStats.restricted,  color: 'var(--status-warning)' },
            { label: 'BLOCKED',      value: roadStats.blocked,     color: 'var(--status-danger)' },
            { label: 'TOTAL NODES',  value: nodeMaster.filter(n => n.x || n.y).length, color: 'var(--accent-cyan)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{label}</div>
            </div>
          ))}
        </div>

        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
            backgroundColor: 'transparent', border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem', cursor: 'pointer', letterSpacing: '0.08em'
          }}
          onClick={() => alert('GeoJSON export would be implemented with backend integration')}
        >
          <Download size={13} /> EXPORT GEOJSON
        </button>
      </div>

      {/* ── Map + Sidebar ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Map Area */}
        <div style={{ flex: 1 }}>
          <OperationalMap height="100%" interactive={true} />
        </div>

        {/* Right Panel */}
        <div style={{
          width: '260px', flexShrink: 0,
          backgroundColor: 'var(--bg-navy)', borderLeft: '1px solid var(--border-light)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto'
        }}>

          {/* Layer Controls */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={13} color="var(--accent-cyan)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>LAYER CONTROLS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <LayerToggle label="Operational Locations" checked={layers.locations}   onChange={() => toggle('locations')}   color="var(--status-info)" />
              <LayerToggle label="Checkpoints"          checked={layers.checkpoints} onChange={() => toggle('checkpoints')} color="var(--status-warning)" />
              <LayerToggle label="Rest Points"          checked={layers.restPoints}  onChange={() => toggle('restPoints')}  color="var(--accent-cyan)" />
              <LayerToggle label="Helipads"             checked={layers.helipads}    onChange={() => toggle('helipads')}    color="var(--status-success)" />
              <LayerToggle label="Road Network"         checked={layers.roads}       onChange={() => toggle('roads')}       color="var(--status-success)" />
              <LayerToggle label="Junctions"            checked={layers.junctions}   onChange={() => toggle('junctions')}   color="var(--text-muted)" />
            </div>
          </div>

          {/* Node Count Summary */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '10px' }}>NODE INVENTORY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Locations', count: nodeStats.L,  color: '#60A5FA' },
                { label: 'Checkpoints', count: nodeStats.CP, color: '#F59E0B' },
                { label: 'Helipads',   count: nodeStats.HP, color: '#22C55E' },
                { label: 'Rest Points',count: nodeStats.RP, color: '#00E5FF' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ backgroundColor: 'var(--bg-card)', padding: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color }}>{count}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Road Status */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '10px' }}>ROAD NETWORK STATUS</div>
            {[
              { label: 'OPEN',       count: roadStats.open,       color: 'var(--status-success)' },
              { label: 'RESTRICTED', count: roadStats.restricted,  color: 'var(--status-warning)' },
              { label: 'BLOCKED',    count: roadStats.blocked,     color: 'var(--status-danger)' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '20px', height: '2px', backgroundColor: color }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Sector Info */}
          <div style={{ padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '10px' }}>SECTOR INFORMATION</div>
            {[
              { label: 'Region',      value: 'Leh–Ladakh' },
              { label: 'Map Ref',     value: 'MAP V5 AC' },
              { label: 'Total Roads', value: roadMaster.length },
              { label: 'Elev Range',  value: '3,144 – 6,000 m' },
              { label: 'Coord Sys',   value: 'CRS.Simple / Pixel' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
