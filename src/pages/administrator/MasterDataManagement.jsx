import React, { useState, useEffect } from 'react';
import { nodeMaster, NODE_TYPES } from '../../data/nodeMaster';
import { roadMaster } from '../../data/roadMaster';
import { roadStatusService } from '../../services/roadStatusService';
import { Database, Map, Cloud, Activity, Clock, AlertTriangle, X } from 'lucide-react';

import { geographicMaster } from '../../data/geographicMaster';
import { checkpointMaster } from '../../data/checkpointMaster';
import { helipadMaster } from '../../data/helipadMaster';
import { restPointMaster } from '../../data/restPointMaster';
import { observationTowerMaster } from '../../data/observationTowerMaster';
import { airRouteMaster } from '../../data/airRouteMaster';
import { terrainMaster } from '../../data/terrainMaster';
import { weatherMaster } from '../../data/weatherMaster';

const TABS = ['NODES', 'ROADS', 'TERRAIN', 'WEATHER', 'AIR ROUTES', 'HELIPADS', 'REST POINTS', 'CHECKPOINTS', 'OBSERVATION TOWERS', 'MODEL CONFIG'];

const MODEL_CONFIG = [
  { param: 'Methodology',        value: 'MCREE + BDMRA (Frozen)' },
  { param: 'Weather Risk',       value: '50% (0.50)' },
  { param: 'Terrain Risk',       value: '30% (0.30)' },
  { param: 'Road Risk',          value: '20% (0.20)' },
  { param: 'Dynamic Weighting',  value: 'OperationalCost = OperationalRisk (Frontend Prototype)' },
  { param: 'Architecture Flow',  value: 'MCREE → Op. Risk → Op. Cost → Dynamic Edge Weight → BDMRA' },
  { param: 'Graph Algorithm',    value: 'Standard Dijkstra' },
  { param: 'Status',             value: 'LOCAL PROTOTYPE' },
];

const TH = ({ children }) => (
  <th style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{children}</th>
);
const TD = ({ children, style, onClick }) => (
  <td onClick={onClick} style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', cursor: onClick ? 'pointer' : 'default', ...style }}>{children}</td>
);

const DataTable = ({ columns, data, idKey, onRowClick }) => (
  <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
        <tr>{columns.map(c => <TH key={c.key}>{c.label}</TH>)}</tr>
      </thead>
      <tbody>
        {data.slice(0, 100).map((row, i) => (
          <tr key={row[idKey] || i} onClick={() => onRowClick && onRowClick(row)} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)', cursor: onRowClick ? 'pointer' : 'default' }}>
            {columns.map(c => (
              <TD key={c.key} style={c.style}>
                {c.render ? c.render(row[c.key], row) : (row[c.key] || '—')}
              </TD>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const MasterDataManagement = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  
  const [editingRoad, setEditingRoad] = useState(null);
  const [roadStatus, setRoadStatus] = useState('OPEN');
  const [statusReason, setStatusReason] = useState('');
  
  // To trigger re-renders when road status changes
  const [tick, setTick] = useState(0);

  const handleSaveRoadStatus = () => {
    if (!editingRoad) return;
    roadStatusService.setRoadStatus(editingRoad.id, roadStatus, statusReason);
    setEditingRoad(null);
    setTick(t => t + 1);
  };

  const getEffectiveRoads = () => {
    return roadStatusService.getAllEffectiveRoads();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      <div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>MASTER DATA MANAGEMENT</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          VIEW-ONLY MODE — FROZEN DATASETS (ROAD STATUS EDITABLE)
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
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

      {tab === 0 && <DataTable idKey="id" data={nodeMaster} columns={[
        { label: 'NODE ID', key: 'id', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'NAME', key: 'name' },
        { label: 'TYPE', key: 'type' },
        { label: 'ELEVATION (m)', key: 'elevation' },
        { label: 'LAT', key: 'lat' },
        { label: 'LNG', key: 'lng' },
        { label: 'MAP Y', key: 'y' },
        { label: 'MAP X', key: 'x' }
      ]} />}

      {tab === 1 && <DataTable idKey="id" data={getEffectiveRoads()} onRowClick={(row) => {
        setEditingRoad(row);
        setRoadStatus(row.operationalStatus || 'OPEN');
        setStatusReason('');
      }} columns={[
        { label: 'ROAD ID', key: 'id', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'FROM', key: 'from' },
        { label: 'TO', key: 'to' },
        { label: 'DIST (km)', key: 'distanceKm' },
        { label: 'STATUS', key: 'operationalStatus', render: (val) => {
          const c = val === 'BLOCKED' ? 'var(--status-danger)' : val === 'RESTRICTED' ? 'var(--status-warning)' : 'var(--status-success)';
          return <span style={{ color: c, fontWeight: 'bold' }}>{val || 'OPEN'}</span>;
        } },
        { label: 'SURFACE', key: 'surfaceType' },
        { label: 'TERRAIN', key: 'terrainType' }
      ]} />}

      {tab === 2 && <DataTable idKey="Terrain ID" data={terrainMaster} columns={[
        { label: 'ROAD ID', key: 'Road ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'TERRAIN TYPE', key: 'Terrain Type' },
        { label: 'ELEVATION', key: 'Avg Elevation (m)' },
        { label: 'DIFFICULTY', key: 'Difficulty Level' },
        { label: 'LANDSLIDE RISK', key: 'Landslide Risk' }
      ]} />}

      {tab === 3 && <DataTable idKey="Weather ID" data={weatherMaster} columns={[
        { label: 'ROAD ID', key: 'Road ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'TEMP (°C)', key: 'Temperature (°C)' },
        { label: 'CONDITION', key: 'Weather Condition' },
        { label: 'VISIBILITY', key: 'Visibility' },
        { label: 'WIND', key: 'Wind Speed (km/h)' }
      ]} />}

      {tab === 4 && <DataTable idKey="Air Route ID" data={airRouteMaster} columns={[
        { label: 'ROUTE ID', key: 'Air Route ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'FROM', key: 'From HP' },
        { label: 'TO', key: 'To HP' },
        { label: 'DIST (km)', key: 'Air Distance (km)' },
        { label: 'TIME (min)', key: 'Flight Time (min)' }
      ]} />}

      {tab === 5 && <DataTable idKey="Helipad ID" data={helipadMaster} columns={[
        { label: 'ID', key: 'Helipad ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'NAME', key: 'Name' },
        { label: 'LOCATION', key: 'Location/Sector' },
        { label: 'ELEVATION', key: 'Elevation (m)' }
      ]} />}

      {tab === 6 && <DataTable idKey="Rest Point ID" data={restPointMaster} columns={[
        { label: 'ID', key: 'Rest Point ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'NAME', key: 'Name' },
        { label: 'CAPACITY', key: 'Capacity (Personnel)' },
        { label: 'FACILITIES', key: 'Facilities' }
      ]} />}

      {tab === 7 && <DataTable idKey="Checkpoint ID" data={checkpointMaster} columns={[
        { label: 'ID', key: 'Checkpoint ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'NAME', key: 'Name' },
        { label: 'LOCATION', key: 'Location/Sector' },
        { label: 'STATUS', key: 'Current Status' }
      ]} />}

      {tab === 8 && <DataTable idKey="Tower ID" data={observationTowerMaster} columns={[
        { label: 'ID', key: 'Tower ID', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'NAME', key: 'Name' },
        { label: 'VISIBILITY', key: 'Visibility Range (km)' },
        { label: 'STATUS', key: 'Status' }
      ]} />}

      {tab === 9 && (
        <div style={{ maxWidth: '640px', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>MCREE MODEL CONFIGURATION — FROZEN DOCUMENTATION RULES</div>
          {MODEL_CONFIG.map(({ param, value }, i) => (
            <div key={param} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{param}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Road Edit Modal */}
      {editingRoad && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '400px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent-cyan)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-sans)', color: 'var(--accent-cyan)' }}>EDIT ROAD STATUS</h2>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingRoad(null)} />
            </div>
            
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              ROAD ID: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{editingRoad.id}</span> ({editingRoad.from} → {editingRoad.to})
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '8px' }}>OPERATIONAL STATUS</div>
              <select 
                value={roadStatus} 
                onChange={e => setRoadStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              >
                <option value="OPEN">OPEN</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '8px' }}>REASON FOR CHANGE</div>
              <input 
                type="text" 
                value={statusReason} 
                onChange={e => setStatusReason(e.target.value)}
                placeholder="e.g. Landslide reported"
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setEditingRoad(null)} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>CANCEL</button>
              <button onClick={handleSaveRoadStatus} style={{ padding: '8px 16px', backgroundColor: 'var(--accent-cyan-dim)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>SAVE STATUS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
