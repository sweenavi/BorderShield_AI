import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Briefcase } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>My Profile</h1>
        <Button variant="primary">Edit Profile</Button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: '1', backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '8px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '2px solid var(--accent-gold)' }}>
            <User size={48} color="var(--text-secondary)" />
          </div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{user?.name || 'Authorized Personnel'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-panel)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <Briefcase size={14} /> {user?.role || 'Mission Planner'}
          </div>
        </div>

        <div style={{ flex: '2', backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '8px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16}/> Email Address</div>
            <div style={{ color: 'var(--text-primary)' }}>{user?.email || 'user@bordershield.local'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>Account Status</div>
            <div style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
