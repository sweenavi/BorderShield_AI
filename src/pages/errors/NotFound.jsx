import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Map } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark-navy)' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <Map size={64} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '2.5rem' }}>404 - SECTOR UNKNOWN</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          The requested operational coordinates do not exist in the current deployment zone.
        </p>
        <Button variant="primary" onClick={() => navigate(-1)}>GO BACK</Button>
      </div>
    </div>
  );
};
