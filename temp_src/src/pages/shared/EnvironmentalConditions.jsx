import React, { useState } from 'react';
import { Cloud, Wind, Thermometer, Eye, Droplets, Mountain, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { nodeMaster } from '../../data/nodeMaster';
import { weatherService } from '../../services/weatherService';

const WEATHER_STATIONS = [
  { id: 'WS-01', name: 'Leh Base Station',      nodeId: 'L01', elevation: 3524 },
  { id: 'WS-02', name: 'Khardung Pass',          nodeId: 'CP04',elevation: 5359 },
  { id: 'WS-03', name: 'Siachen Glacier Base',   nodeId: 'L16', elevation: 4486 },
  { id: 'WS-04', name: 'Nubra Valley',           nodeId: 'L08', elevation: 3186 },
  { id: 'WS-05', name: 'Daulat Beg Oldie',       nodeId: 'L20', elevation: 5428 },
  { id: 'WS-06', name: 'Hunder Junction',        nodeId: 'CP03',elevation: 3665 },
];

const FEASIBILITY = [
  { mode: 'Foot Patrol',    min: -15, maxWind: 80, minVis: 200,  maxSnow: 30  },
  { mode: 'Heavy Convoy',   min: -10, maxWind: 50, minVis: 1000, maxSnow: 10  },
  { mode: 'Light Vehicle',  min: -12, maxWind: 65, minVis: 500,  maxSnow: 20  },
  { mode: 'Helicopter Ops', min: -20, maxWind: 40, minVis: 2000, maxSnow: 5   },
];

const TABS = ['LIVE CONDITIONS', 'WEATHER STATIONS', 'HISTORICAL TREND', 'MOVEMENT FEASIBILITY'];

const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
  <div style={{
    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)',
    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Icon size={13} color={color || 'var(--text-muted)'} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{label}</span>
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>
      {value}<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '4px' }}>{unit}</span>
    </div>
  </div>
);

const feasibilityStatus = (mode, weather) => {
  const f = FEASIBILITY.find(f => f.mode === mode);
  if (!f) return 'UNKNOWN';
  if (weather.temperature < f.min || weather.windSpeed > f.maxWind ||
      weather.visibility < f.minVis || weather.snowfall > f.maxSnow) {
    return 'NOT FEASIBLE';
  }
  if (weather.windSpeed > f.maxWind * 0.7 || weather.visibility < f.minVis * 1.5) return 'MARGINAL';
  return 'FEASIBLE';
};

export const EnvironmentalConditions = () => {
  const [activeTab, setActiveTab] = useState(0);
  const sampleWeather = weatherService.getWeatherForNode('L01') || {
    condition: 'Partly Cloudy', temperature: -3, snowfall: 8, visibility: 4200,
    windSpeed: 34, humidity: 62, pressure: 640
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>ENVIRONMENTAL CONDITIONS</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginTop: '4px' }}>
            METEOROLOGICAL INTELLIGENCE — LEH-LADAKH-SIACHEN SECTOR
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--status-success)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            LIVE FEED ACTIVE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            UTC {new Date().toISOString().substring(11,19)} Z
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-light)' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{
            padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.06em', border: 'none', cursor: 'pointer',
            backgroundColor: 'transparent',
            color: activeTab === i ? 'var(--accent-cyan)' : 'var(--text-muted)',
            borderBottom: activeTab === i ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            transition: 'all 0.15s',
            marginBottom: '-1px'
          }}>{tab}</button>
        ))}
      </div>

      {/* ─────────────────── TAB 0: LIVE CONDITIONS ─────────────────── */}
      {activeTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px',
            backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)'
          }}>
            <Cloud size={28} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700 }}>{sampleWeather.condition?.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>PRIMARY SECTOR CONDITION — BASED ON WEIGHTED ZONE AVERAGE</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <MetricCard icon={Thermometer} label="TEMPERATURE"  value={sampleWeather.temperature}   unit="°C"   color={sampleWeather.temperature < -10 ? 'var(--status-danger)' : 'var(--accent-cyan)'} />
            <MetricCard icon={Cloud}       label="SNOWFALL"     value={sampleWeather.snowfall}       unit="mm/h" color={sampleWeather.snowfall > 15 ? 'var(--status-warning)' : 'var(--text-primary)'} />
            <MetricCard icon={Eye}         label="VISIBILITY"   value={(sampleWeather.visibility/1000).toFixed(1)} unit="km" color={sampleWeather.visibility < 1000 ? 'var(--status-danger)' : 'var(--status-success)'} />
            <MetricCard icon={Wind}        label="WIND SPEED"   value={sampleWeather.windSpeed}      unit="km/h" color={sampleWeather.windSpeed > 60 ? 'var(--status-warning)' : 'var(--text-primary)'} />
            <MetricCard icon={Droplets}    label="HUMIDITY"     value={sampleWeather.humidity || 62} unit="%"   color="var(--text-primary)" />
            <MetricCard icon={Mountain}    label="ATM PRESSURE" value={sampleWeather.pressure || 640} unit="hPa" color="var(--text-secondary)" />
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 1: WEATHER STATIONS ────────────────── */}
      {activeTab === 1 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-navy)' }}>
                {['STATION', 'LOCATION', 'ELEVATION', 'TEMP (°C)', 'SNOWFALL', 'VISIBILITY', 'MOVEMENT', 'RISK'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEATHER_STATIONS.map((ws, i) => {
                const w = weatherService.getWeatherForNode(ws.nodeId) || { temperature: -3, snowfall: 8, visibility: 4200, windSpeed: 34 };
                const node = nodeMaster.find(n => n.id === ws.nodeId);
                const risk = w.snowfall > 20 ? 'HIGH' : w.snowfall > 10 ? 'MEDIUM' : 'LOW';
                const riskColor = risk === 'HIGH' ? 'var(--status-danger)' : risk === 'MEDIUM' ? 'var(--status-warning)' : 'var(--status-success)';
                return (
                  <tr key={ws.id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-navy)' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)' }}>{ws.id}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{ws.name}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{ws.elevation} m</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: w.temperature < -10 ? 'var(--status-danger)' : 'var(--text-primary)' }}>{w.temperature}°C</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>{w.snowfall} mm</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: w.visibility < 1000 ? 'var(--status-danger)' : 'var(--text-primary)' }}>{(w.visibility/1000).toFixed(1)} km</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--status-success)' }}>POSSIBLE</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: riskColor, border: `1px solid ${riskColor}`, padding: '2px 8px', letterSpacing: '0.08em' }}>{risk}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─────────────────── TAB 2: HISTORICAL TREND ────────────────── */}
      {activeTab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>24-HOUR HISTORICAL DEGRADATION & FORECAST</div>
          {/* Synthetic bars for 24h temp chart */}
          {[
            { label: 'TEMPERATURE (°C)', data: [-2,-3,-4,-5,-5,-4,-3,-2,-1,0,1,2,3,2,1,0,-1,-2,-3,-4,-4,-3,-2,-1], color: 'var(--accent-cyan)', unit: '°C', min: -6, max: 4 },
            { label: 'SNOWFALL (mm/h)',  data: [5,6,8,10,12,11,9,8,7,6,5,4,3,4,5,6,7,8,9,8,7,6,5,4], color: 'var(--status-info)', unit: 'mm', min: 0, max: 15 },
            { label: 'VISIBILITY (km)', data: [5,4.5,3.8,3,2.5,2,2.2,2.8,3.5,4,4.5,5,5.2,4.8,4.5,4,3.5,3,2.8,3,3.2,3.8,4,4.5], color: 'var(--status-success)', unit: 'km', min: 0, max: 6 },
          ].map(({ label, data, color, unit, min, max }) => (
            <div key={label} style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '12px' }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px' }}>
                {data.map((v, i) => {
                  const pct = ((v - min) / (max - min)) * 100;
                  const isNow = i === 12;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{
                        width: '100%', backgroundColor: isNow ? color : `${color}60`,
                        height: `${Math.max(8, pct)}%`,
                        border: isNow ? `1px solid ${color}` : 'none',
                        transition: 'height 0.3s'
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)' }}>
                <span>-12h</span><span style={{ color }}>NOW</span><span>+12h</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────── TAB 3: MOVEMENT FEASIBILITY ────────────── */}
      {activeTab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            MOVEMENT FEASIBILITY ASSESSMENT — BASED ON CURRENT SECTOR CONDITIONS
          </div>
          {FEASIBILITY.map(({ mode }) => {
            const status = feasibilityStatus(mode, sampleWeather);
            const color = status === 'FEASIBLE' ? 'var(--status-success)' : status === 'MARGINAL' ? 'var(--status-warning)' : 'var(--status-danger)';
            const Icon = status === 'FEASIBLE' ? CheckCircle : status === 'MARGINAL' ? AlertTriangle : XCircle;
            return (
              <div key={mode} style={{
                backgroundColor: 'var(--bg-navy)', border: `1px solid var(--border-light)`,
                borderLeft: `3px solid ${color}`,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '4px' }}>{mode}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    Temp: {sampleWeather.temperature}°C | Wind: {sampleWeather.windSpeed} km/h | Vis: {(sampleWeather.visibility/1000).toFixed(1)} km | Snow: {sampleWeather.snowfall} mm/h
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color }}>
                  <Icon size={18} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' }}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
