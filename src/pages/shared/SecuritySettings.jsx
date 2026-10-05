import React from 'react';
import { Shield, Key, Smartphone, LogOut } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const SecuritySettings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield color="var(--accent-gold)" /> Security Settings
      </h1>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-medium)', paddingBottom: '24px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Key size={18} /> Password Management</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Update your operational access credentials.</p>
          </div>
          <Button variant="secondary">Change Password</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-medium)', paddingBottom: '24px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={18} /> Multi-Factor Authentication (MFA)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>MFA is currently <strong style={{ color: 'var(--status-success)' }}>ENABLED</strong> on this account.</p>
          </div>
          <Button variant="secondary">Manage MFA</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><LogOut size={18} /> Active Sessions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You are currently logged in from 1 location.</p>
          </div>
          <Button variant="secondary" style={{ color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}>Terminate All Sessions</Button>
        </div>
      </div>
    </div>
  );
};
