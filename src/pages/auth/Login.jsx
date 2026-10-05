import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ChevronDown } from 'lucide-react';

export const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [demoRole, setDemoRole] = useState('planner');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const id = credentials.id.toLowerCase();
    let roleKey = 'planner';
    if (id.includes('admin'))   roleKey = 'admin';
    else if (id.includes('ops') || id.includes('road')) roleKey = 'ops';
    else if (id.includes('planner')) roleKey = 'planner';
    else if (credentials.id.trim() === '') {
      setError('OPERATIONAL ID IS REQUIRED');
      return;
    }
    // Use demo role selector override for demo mode
    navigate(`/auth/mfa?role=${demoRole}`);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
    backgroundColor: 'var(--bg-dark-navy)',
    border: '1px solid var(--border-medium)',
    color: 'var(--text-primary)',
    outline: 'none', fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      backgroundColor: 'var(--bg-dark-navy)', color: 'var(--text-primary)', overflow: 'hidden'
    }}>

      {/* ── LEFT: Full Branding ─────────────────────────────────────── */}
      <div style={{
        flex: '0 0 44%',
        backgroundColor: 'var(--bg-navy)',
        borderRight: '1px solid var(--border-medium)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Tactical grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--border-medium) 1px, transparent 1px), linear-gradient(90deg, var(--border-medium) 1px, transparent 1px)',
          backgroundSize: '24px 24px', pointerEvents: 'none'
        }} />
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '64px', height: '64px', borderTop: '2px solid var(--accent-cyan)', borderLeft: '2px solid var(--accent-cyan)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '64px', height: '64px', borderBottom: '2px solid var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)', opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <img
            src="/logo.png" alt="BorderShield AI"
            style={{ width: '160px', height: 'auto', marginBottom: '28px', filter: 'drop-shadow(0 0 24px rgba(0,229,255,0.2))' }}
          />
          <h1 style={{
            margin: '0 0 8px 0', fontSize: '1.875rem', fontFamily: 'var(--font-sans)',
            fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)'
          }}>BORDERSHIELD AI</h1>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
            color: 'var(--accent-cyan)', letterSpacing: '0.18em', fontWeight: 600, marginBottom: '36px'
          }}>
            AI-BASED ROUTE RISK PREDICTION & DECISION SUPPORT
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem', letterSpacing: '0.14em'
          }}>◆ LEH–LADAKH–SIACHEN SECTOR ◆</div>
        </div>

        {/* System services row */}
        <div style={{
          position: 'absolute', bottom: '24px',
          left: '48px', right: '48px',
          display: 'flex', gap: '16px',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: 'var(--text-muted)'
        }}>
          {['ROUTING ENGINE', 'ML MODEL', 'RISK ENGINE', 'XAI MODULE'].map(svc => (
            <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--status-success)', fontSize: '0.55rem' }}>●</span>
              {svc}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Authentication ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}>
                SECURE AUTHENTICATION
              </h2>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              RESTRICTED — AUTHORIZED PERSONNEL ONLY
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div style={{ padding: '10px 14px', border: '1px solid var(--status-danger)', backgroundColor: 'var(--status-danger-dim)', color: 'var(--status-danger)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                ⚠ {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>OPERATIONAL ID</label>
              <input
                type="text" value={credentials.id}
                onChange={e => setCredentials({ ...credentials, id: e.target.value })}
                placeholder="officer@bordershield.local"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>PASSWORD / PASSKEY</label>
              <input
                type="password" value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
                required
              />
            </div>

            {/* Demo Role Select */}
            <div style={{ border: '1px solid var(--border-medium)', padding: '12px', backgroundColor: 'rgba(201,168,76,0.04)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', color: 'var(--accent-gold)', letterSpacing: '0.12em', marginBottom: '8px' }}>◆ DEMO ROLE SELECT</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'planner', label: 'Officer' },
                  { key: 'ops',     label: 'Road Ops' },
                  { key: 'admin',   label: 'Admin' },
                ].map(r => (
                  <button
                    key={r.key} type="button"
                    onClick={() => setDemoRole(r.key)}
                    style={{
                      flex: 1, padding: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
                      border: demoRole === r.key ? '1px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                      backgroundColor: demoRole === r.key ? 'var(--accent-cyan-dim)' : 'transparent',
                      color: demoRole === r.key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >{r.label}</button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '14px',
                backgroundColor: 'transparent', border: '1px solid var(--accent-cyan)',
                color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem', letterSpacing: '0.12em', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent-cyan-dim)';
                e.currentTarget.style.boxShadow = 'var(--glow-cyan)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Lock size={14} /> AUTHENTICATE & PROCEED
            </button>
          </form>

          <div style={{ marginTop: '28px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.8 }}>
            System access is restricted to authorized personnel only.<br />
            Contact Administrator for credential provisioning.
          </div>
        </div>
      </div>
    </div>
  );
};
