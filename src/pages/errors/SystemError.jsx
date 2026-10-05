import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AlertTriangle } from 'lucide-react';

export const SystemError = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <AlertTriangle size={64} color="var(--status-warning)" style={{ marginBottom: '24px' }} />
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '2.5rem' }}>500 - SYSTEM MALFUNCTION</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          A critical failure occurred in the frontend operational layer. Support teams have been notified.
        </p>
        <Button variant="secondary" onClick={() => navigate(-1)}>RETRY CONNECTION</Button>
      </div>
    </div>
  );
};
