import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Shield } from 'lucide-react';
import { ROUTES } from '../../app/routes';

export const AccountActivation = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)', backgroundImage: 'radial-gradient(circle at center, var(--bg-navy) 0%, var(--bg-dark-navy) 100%)'
    }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-medium)', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-panel)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Shield size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>ACCOUNT ACTIVATION</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Set your credentials to access BorderShield AI</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>New Password</label>
            <input type="password" required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
            <input type="password" required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Must contain at least 12 characters, including uppercase, lowercase, numbers, and symbols.
          </div>
          <Button type="button" variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate(ROUTES.AUTH.MFA)}>
            ACTIVATE ACCOUNT
          </Button>
        </form>
      </div>
    </div>
  );
};
