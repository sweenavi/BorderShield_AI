import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService } from '../../services/routingService';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { nodeMaster } from '../../data/nodeMaster';

const KpiCard = ({ label, value, sub, color, big }) => (
  <div style={{
    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)',
    padding: big ? '20px 24px' : '16px 20px', flex: 1
  }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: big ? '2rem' : '1.375rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const FactorBar = ({ label, value, positive }) => {
  const color = positive ? 'var(--status-danger)' : 'var(--status-success)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ width: '120px', height: '6px', backgroundColor: 'var(--bg-dark-navy)', position: 'relative' }}>
        <div style={{ height: '100%', width: `${Math.abs(value) * 8}%`, backgroundColor: color, maxWidth: '100%' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color, width: '40px', textAlign: 'right', fontWeight: 700 }}>
        {positive ? '+' : '-'}{Math.abs(value)}%
      </div>
    </div>
  );
};

export const RiskAnalysis = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mission = missionId ? missionService.getMissionById(missionId) : null;
  let routeResult = missionId ? missionService.getRouteResult(missionId) : null;

  if (!missionId) {
    const missions = missionService.getMissions();
    // Only missions that can legitimately be routed
    const selectableMissions = missions.filter(m => {
      // Must have valid nodes
      return nodeMaster.some(n => n.id === m.sourceId) && nodeMaster.some(n => n.id === m.destinationId);
    });

    return (
      <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>SELECT MISSION FOR RISK ANALYSIS</h1>
        {selectableMissions.length === 0 ? (
          <div style={{ color: 'var(--status-warning)' }}>NO MISSIONS WITH CALCULATED ROUTES FOUND.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectableMissions.map(m => (
              <div key={m.id} style={{ backgroundColor: 'var(--bg-navy)', padding: '16px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{m.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.sourceId} &rarr; {m.destinationId}</div>
                </div>
                <button onClick={() => navigate(location.pathname.includes('admin') ? `/admin/missions/${m.id}/risk` : `/planner/missions/${m.id}/risk`)}
                        style={{ padding: '8px 16px', backgroundColor: 'var(--status-danger-dim)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', cursor: 'pointer' }}>
                  ANALYZE RISK
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!mission) return (
    <div style={{ padding: '24px', fontFamily: 'var(--font-mono)', color: 'var(--status-warning)' }}>
      MISSION NOT FOUND. <a href="/planner/missions" style={{ color: 'var(--accent-cyan)' }}>Return to Missions</a>
    </div>
  );

  const rec = routeResult?.recommended;
  const mcree = routeResult?.mcree;
  const risk = rec ? rec.metrics.averageRisk : 0;
  const riskColor = risk >= 76 ? 'var(--status-danger)' : risk >= 51 ? 'var(--status-warning)' : risk >= 26 ? 'var(--accent-cyan)' : 'var(--status-success)';
  const riskLabel = risk >= 76 ? 'CRITICAL RISK' : risk >= 51 ? 'HIGH RISK' : risk >= 26 ? 'MODERATE RISK' : 'LOW RISK';

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>RISK ANALYSIS & XAI</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            MISSION {missionId} · {mission.sourceId} → {mission.destinationId}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>ANALYSIS MODEL</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>MCREE + BDMRA</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {routeResult?.timestamp ? new Date(routeResult.timestamp).toLocaleString('en-GB') : '—'}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <KpiCard label="AVERAGE ROUTE RISK" value={`${risk}%`} color={riskColor} big sub={riskLabel} />
        <KpiCard label="CUMULATIVE COST" value={rec ? rec.metrics.cumulativeCost : '—'} color="var(--text-primary)" big />
        <KpiCard label="TOTAL DISTANCE" value={rec ? `${rec.metrics.totalDistance} km` : '—'} color="var(--text-primary)" big />
        <KpiCard label="ESTIMATED ETA" value={rec ? `${Math.floor(rec.metrics.totalETA/60)}h ${Math.round(rec.metrics.totalETA%60)}m` : '—'} color="var(--text-primary)" big />
      </div>

      {/* Decision Engine Assessment */}
      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={14} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DECISION ENGINE ASSESSMENT — BDMRA RECOMMENDATION</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ borderLeft: '2px solid var(--border-medium)', paddingLeft: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RECOMMENDED ROUTE PATH</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{rec ? rec.path.join(' → ') : 'N/A'}</div>
          </div>
          <div style={{ borderLeft: '2px solid var(--border-medium)', paddingLeft: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ROUTE CLASSIFICATION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: riskColor }}>{riskLabel}</div>
          </div>
        </div>
      </div>

      {/* MCREE Segment Analysis */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px' }}>MCREE SEGMENT ANALYSIS</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rec?.segments?.map((seg, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {seg.roadId}: {seg.from} → {seg.to} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '8px' }}>({seg.distance} km)</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  Operational Risk: <strong>{seg.operationalRisk}%</strong>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {/* Weather */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>WEATHER (50% WEIGHT)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div>Temp: {seg.rawWeather?.['Temperature (°C)']}°C</div>
                    <div>Condition: {seg.rawWeather?.['Weather Condition']}</div>
                    <div>Wind: {seg.rawWeather?.['Wind Speed (km/h)']} km/h</div>
                  </div>
                  <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                    Standardized Risk: {seg.weatherRisk}%
                  </div>
                </div>

                {/* Terrain */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TERRAIN (30% WEIGHT)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div>Type: {seg.rawTerrain?.['Terrain Type']}</div>
                    <div>Elevation: {seg.rawTerrain?.['Avg Elevation (m)']}m</div>
                    <div>Landslide: {seg.rawTerrain?.['Landslide Risk']}</div>
                  </div>
                  <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                    Standardized Risk: {seg.terrainRisk}%
                  </div>
                </div>

                {/* Road */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ROAD (20% WEIGHT)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div>Surface: {seg.surfaceType}</div>
                    <div>Condition: {seg.roadCondition}</div>
                  </div>
                  <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                    Standardized Risk: {seg.roadRisk}%
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dotted var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Calculation: (0.50 × {seg.weatherRisk}) + (0.30 × {seg.terrainRisk}) + (0.20 × {seg.roadRisk}) = <strong>{seg.operationalRisk}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Section */}
      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', marginTop: '20px' }}>
        <button
          onClick={() => setShowAdvanced(v => !v)}
          style={{
            width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={13} />
            MCREE DIAGNOSTICS
          </div>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showAdvanced && (
          <div style={{ borderTop: '1px solid var(--border-light)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { label: 'MODEL',             value: 'MCREE Weights' },
              { label: 'WEATHER WEIGHT',    value: `${mcree?.weights?.weather || 0.50} (50%)` },
              { label: 'TERRAIN WEIGHT',    value: `${mcree?.weights?.terrain || 0.30} (30%)` },
              { label: 'ROAD WEIGHT',       value: `${mcree?.weights?.road || 0.20} (20%)` },
              { label: 'DYNAMIC COST FORMULA', value: 'Cost = V_base / V_effective * Base Distance * (1 + Operational Risk / 100)' },
              { label: 'STATUS',            value: 'LOCAL PROTOTYPE' }
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
