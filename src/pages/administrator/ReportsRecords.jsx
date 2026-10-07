import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { routingService } from '../../services/routingService';
import { FileText, Download, Printer, Eye, CheckCircle, Clock } from 'lucide-react';

export const ReportsRecords = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const liveMissions = missionService.getMissions();

  const allReports = [
    ...liveMissions.map(m => {
      let routeRes = missionService.getRouteResult(m.id);
      if (!routeRes && m.sourceId && m.destinationId) {
        routeRes = routingService.calculateRoute(m.sourceId, m.destinationId, m);
        if (routeRes) missionService.saveRouteResult(m.id, routeRes);
      }
      return {
        id: `RPT-${m.id}`,
        missionId: m.id,
        mission: `${m.missionName || m.missionType} — ${m.sourceId}→${m.destinationId}`,
        generated: m.createdAt ? new Date(m.createdAt).toLocaleString('en-GB') : '—',
        generatedBy: 'Mission Planner',
        type: 'MISSION ANALYSIS',
        status: m.status === 'COMPLETED' ? 'READY' : 'PENDING',
        risk: routeRes ? `${routeRes.recommended?.metrics?.averageRisk || '—'}%` : '—',
        route: routeRes ? routeRes.recommended?.routeId || '—' : '—',
      };
    })
  ];

  const stats = {
    ready: allReports.filter(r => r.status === 'READY').length,
    pending: allReports.filter(r => r.status === 'PENDING').length,
    total: allReports.length,
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.04em' }}>REPORTS CENTER</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>MISSION ANALYSIS RECORDS & AFTER-ACTION REPORTS</div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { label: 'READY REPORTS', value: stats.ready,   color: 'var(--status-success)' },
          { label: 'PENDING',       value: stats.pending,  color: 'var(--status-warning)' },
          { label: 'TOTAL RECORDS', value: stats.total,    color: 'var(--accent-cyan)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: 1, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '14px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Reports Table */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['REPORT ID', 'MISSION', 'GENERATED', 'BY', 'RISK', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allReports.map((r, i) => (
                  <tr key={r.id} onClick={() => setSelected(r)} style={{
                    borderBottom: '1px solid var(--border-light)', cursor: 'pointer',
                    backgroundColor: selected?.id === r.id ? 'var(--accent-cyan-dim)' : i % 2 === 0 ? 'transparent' : 'var(--bg-card)',
                    transition: 'background 0.1s'
                  }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{r.id}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.mission}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.generated}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-secondary)' }}>{r.generatedBy}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>{r.risk}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {r.status === 'READY'
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem' }}><CheckCircle size={11} /> READY</span>
                        : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-warning)', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem' }}><Clock size={11} /> PENDING</span>
                      }
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          { icon: Eye,      label: 'VIEW',     action: () => setSelected(r) },
                          { icon: Download, label: 'PDF',      action: () => navigate(`/admin/missions/${r.missionId}/report?action=print`) },
                          { icon: Printer,  label: 'PRINT',    action: () => navigate(`/admin/missions/${r.missionId}/report?action=print`) },
                        ].map(({ icon: Ic, label, action }) => (
                          <button key={label} onClick={e => { e.stopPropagation(); action(); }} style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px',
                            fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.06em',
                            border: '1px solid var(--border-medium)', backgroundColor: 'transparent',
                            color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap'
                          }}>
                            <Ic size={10} />{label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Panel */}
        {selected && (
          <div style={{ width: '280px', flexShrink: 0, backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <FileText size={14} color="var(--accent-cyan)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>REPORT PREVIEW</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>{selected.id}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{selected.generated}</div>

            {/* Report outline */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>REPORT SECTIONS</div>
            {[
              'MISSION INFORMATION',
              'ENVIRONMENTAL CONDITIONS',
              'ROUTE COMPARISON (A / B / C)',
              'AI PREDICTION — MCREE',
              'XAI EXPLANATION',
              'RECOMMENDED ROUTE',
              'ALTERNATE ROUTES',
              'OPERATIONAL NOTES',
              'TIMESTAMP & SIGNATURE',
            ].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', borderBottom: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '16px' }}>{i+1}.</span>
                {s}
              </div>
            ))}

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button style={{ padding: '9px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', backgroundColor: 'var(--accent-cyan-dim)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', letterSpacing: '0.06em' }}
                onClick={() => navigate(`/admin/missions/${selected.missionId}/report`)}>
                VIEW FULL REPORT
              </button>
              <button style={{ padding: '9px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', cursor: 'pointer', letterSpacing: '0.06em' }}
                onClick={() => navigate(`/admin/missions/${selected.missionId}/report?action=print`)}>
                DOWNLOAD PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
