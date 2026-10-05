import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Shield } from 'lucide-react';
import { ROUTES } from '../../app/routes';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-medium)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Shield size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>CREDENTIAL RECOVERY</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter your registered operational email.</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <Button type="button" variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate(ROUTES.AUTH.LOGIN)}>
            SUBMIT REQUEST
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.AUTH.LOGIN)}>
            RETURN TO LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};
