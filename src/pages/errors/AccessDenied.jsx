import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../../app/routes';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <ShieldAlert size={64} color="var(--status-danger)" style={{ marginBottom: '24px' }} />
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '2.5rem' }}>403 - ACCESS DENIED</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Your current clearance level does not permit access to this sector. 
          This incident has been logged.
        </p>
        <Button variant="primary" onClick={() => navigate(ROUTES.AUTH.LOGIN)}>RETURN TO SECURE LOGIN</Button>
      </div>
    </div>
  );
};
