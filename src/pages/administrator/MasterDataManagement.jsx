import React, { useState } from 'react';
import { nodeMaster, NODE_TYPES } from '../../data/nodeMaster';
import { roadMaster } from '../../data/roadMaster';
import { Database, Map, Cloud, Activity, Clock, AlertTriangle } from 'lucide-react';

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
  { param: 'Dynamic Weighting',  value: 'Cost = V_base/V_effective * Dist * (1 + OperationalRisk/100)' },
  { param: 'Graph Algorithm',    value: 'Standard Dijkstra' },
  { param: 'Status',             value: 'LOCAL PROTOTYPE' },
];

const TH = ({ children }) => (
  <th style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{children}</th>
);
const TD = ({ children, style }) => (
  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', ...style }}>{children}</td>
);

const DataTable = ({ columns, data, idKey }) => (
  <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-navy)', zIndex: 1 }}>
        <tr>{columns.map(c => <TH key={c.key}>{c.label}</TH>)}</tr>
      </thead>
      <tbody>
        {data.slice(0, 100).map((row, i) => (
          <tr key={row[idKey] || i} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
            {columns.map(c => (
              <TD key={c.key} style={c.style}>{row[c.key] || '—'}</TD>
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

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>MASTER DATA MANAGEMENT</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          VIEW-ONLY MODE — FROZEN DATASETS
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

      {tab === 1 && <DataTable idKey="id" data={roadMaster} columns={[
        { label: 'ROAD ID', key: 'id', style: { color: 'var(--accent-cyan)', fontWeight: 600 } },
        { label: 'FROM', key: 'from' },
        { label: 'TO', key: 'to' },
        { label: 'DIST (km)', key: 'distanceKm' },
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
    </div>
  );
};
