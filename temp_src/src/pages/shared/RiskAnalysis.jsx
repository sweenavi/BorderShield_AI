import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService } from '../../services/routingService';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, ChevronDown, ChevronUp, Activity } from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mission = missionService.getMissionById(missionId);
  let routeResult = missionService.getRouteResult(missionId);
  if (!routeResult && mission) {
    routeResult = routingService.calculateRoute(mission.sourceId, mission.destinationId, mission);
  }

  if (!mission) return (
    <div style={{ padding: '24px', fontFamily: 'var(--font-mono)', color: 'var(--status-warning)' }}>
      MISSION NOT FOUND. <a href="/planner/missions" style={{ color: 'var(--accent-cyan)' }}>Return to Missions</a>
    </div>
  );

  const rec = routeResult?.recommended;
  const mcree = routeResult?.mcreeResult;
  const risk = mcree?.operationalRisk || 18;
  const safety = 100 - risk;
  const riskColor = risk >= 76 ? 'var(--status-danger)' : risk >= 51 ? 'var(--status-warning)' : risk >= 26 ? 'var(--accent-cyan)' : 'var(--status-success)';
  const riskLabel = risk >= 76 ? 'CRITICAL RISK' : risk >= 51 ? 'HIGH RISK' : risk >= 26 ? 'MODERATE RISK' : 'LOW RISK';

  const contributors = mcree?.riskContributors || [
    { label: 'Snowfall Intensity',      value: 8, positive: true  },
    { label: 'Low Visibility',          value: 5, positive: true  },
    { label: 'Terrain Slope (avg)',     value: 3, positive: true  },
    { label: 'Historical Closure Rate', value: 2, positive: true  },
    { label: 'High Elevation Exposure', value: 2, positive: true  },
  ];
  const mitigators = mcree?.riskMitigators || [
    { label: 'Support Facilities Nearby', value: 6, positive: false },
    { label: 'Road Clearance History',    value: 4, positive: false },
    { label: 'Valley Corridor Protection', value: 3, positive: false },
  ];

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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>MCREE v2.0 + BDMRA</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {new Date().toUTCString().substring(0,25)}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <KpiCard label="PREDICTED RISK"        value={`${risk}%`}      color={riskColor} big sub={riskLabel} />
        <KpiCard label="SAFETY INDEX"          value={`${safety}%`}    color="var(--status-success)" big />
        <KpiCard label="CLOSURE PROBABILITY"   value={`${Math.round(risk*0.65)}%`}  color="var(--status-warning)" sub="30-DAY ESTIMATE" />
        <KpiCard label="CONVOY FEASIBILITY"    value={safety > 60 ? 'FEASIBLE' : 'MARGINAL'} color={safety > 60 ? 'var(--status-success)' : 'var(--status-warning)'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* XAI: Risk Contributors */}
        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={14} color="var(--status-danger)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>RISK CONTRIBUTORS (ADVERSE FACTORS)</span>
          </div>
          {contributors.map((f, i) => <FactorBar key={i} label={f.label} value={f.value} positive={true} />)}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--status-danger-dim)', border: '1px solid var(--status-danger-border)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--status-danger)' }}>
            TOTAL ADVERSE WEIGHT: +{contributors.reduce((s, f) => s + f.value, 0)}%
          </div>
        </div>

        {/* XAI: Mitigating Factors */}
        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingDown size={14} color="var(--status-success)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>RISK MITIGATORS (FAVOURABLE FACTORS)</span>
          </div>
          {mitigators.map((f, i) => <FactorBar key={i} label={f.label} value={f.value} positive={false} />)}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--status-success-dim)', border: '1px solid var(--status-success-border)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--status-success)' }}>
            TOTAL MITIGATION WEIGHT: -{mitigators.reduce((s, f) => s + f.value, 0)}%
          </div>
        </div>
      </div>

      {/* Decision Engine Assessment */}
      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={14} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DECISION ENGINE ASSESSMENT — BDMRA RECOMMENDATION</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: 'RECOMMENDED ROUTE', value: routeResult?.recommended?.routeId || 'ROUTE B', color: 'var(--accent-cyan)' },
            { label: 'DIJKSTRA COST',     value: `${(routeResult?.recommended?.totalCost || 42.3).toFixed(1)} units`, color: 'var(--text-primary)' },
            { label: 'ETA',               value: routeResult?.recommended?.eta || '4h 20m', color: 'var(--text-primary)' },
            { label: 'CONFIDENCE',        value: `${mcree?.confidence || 94}%`, color: 'var(--status-success)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ borderLeft: '2px solid var(--border-medium)', paddingLeft: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', backgroundColor: safety > 70 ? 'var(--status-success-dim)' : 'var(--status-warning-dim)', border: `1px solid ${safety > 70 ? 'var(--status-success-border)' : 'var(--status-warning-border)'}`, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: safety > 70 ? 'var(--status-success)' : 'var(--status-warning)' }}>
          <strong>ASSESSMENT:</strong> {safety > 70 ? 'Route is operationally viable. Proceed with standard precautions. Weather conditions are within acceptable parameters for convoy movement.' : 'Route has elevated risk. Officer review required. Consider timing modification or route alternative.'}
        </div>
        <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)' }}>
          ⓘ This system provides decision support only. Final operational authority rests with the commanding officer.
        </div>
      </div>

      {/* Advanced Section */}
      <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)' }}>
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
            ADVANCED MODEL DIAGNOSTICS
          </div>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showAdvanced && (
          <div style={{ borderTop: '1px solid var(--border-light)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { label: 'MODEL',             value: 'Random Forest v1.0' },
              { label: 'FEATURES USED',     value: '18 inputs' },
              { label: 'TRAINING DATE',     value: '2026-07-15' },
              { label: 'WEATHER WEIGHT',    value: `${mcree?.weights?.weather || 0.35} (35%)` },
              { label: 'TERRAIN WEIGHT',    value: `${mcree?.weights?.terrain || 0.30} (30%)` },
              { label: 'ROAD WEIGHT',       value: `${mcree?.weights?.road || 0.20} (20%)` },
              { label: 'HISTORICAL WEIGHT', value: `${mcree?.weights?.historical || 0.15} (15%)` },
              { label: 'BASE RISK',         value: `${mcree?.baseRisk || 12}%` },
              { label: 'DYNAMIC ADJUSTMENT',value: `+${risk - (mcree?.baseRisk || 12)}%` },
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
