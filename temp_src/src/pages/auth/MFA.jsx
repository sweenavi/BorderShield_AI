import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../../app/routes';
import { useAuth } from '../../context/AuthContext';

export const MFA = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const handleVerify = () => {
    const roleParam = searchParams.get('role');
    // login() now accepts a roleKey ('admin', 'planner', 'ops')
    login(roleParam || 'planner');
    if (roleParam === 'admin') {
      navigate('/admin/dashboard');
    } else if (roleParam === 'ops') {
      navigate('/ops/dashboard');
    } else {
      navigate('/planner/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-medium)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <ShieldAlert size={48} color="var(--status-info)" style={{ marginBottom: '16px' }} />
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>IDENTITY VERIFICATION</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter the 6-digit code from your authenticator device.</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input type="text" maxLength={6} required placeholder="000000" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontFamily: 'var(--font-mono)' }} />
          </div>
          <Button type="button" variant="primary" style={{ marginTop: '16px' }} onClick={handleVerify}>
            VERIFY
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.AUTH.LOGIN)}>
            BACK TO LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};
