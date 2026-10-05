import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const MissionsList = () => {
  const { missions } = useMission();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>My Missions</h1>
        <Button variant="primary" onClick={() => navigate('/planner/missions/create')}>Create Mission</Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input type="text" placeholder="Search missions by ID, source, or destination..." style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--text-primary)' }} />
        </div>
        <Button variant="secondary"><Filter size={16} /> Filters</Button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Mission ID</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Date</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Route</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Status</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Priority</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {missions.map((mission) => (
              <tr key={mission.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{mission.id}</td>
                <td style={{ padding: '16px' }}>{new Date(mission.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>{mission.sourceId} &rarr; {mission.destinationId}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: mission.status === 'PENDING AUTHORIZATION' ? 'rgba(245, 158, 11, 0.2)' : 
                                     mission.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' :
                                     mission.status === 'REJECTED' || mission.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' :
                                     'var(--bg-panel)', 
                    color: mission.status === 'PENDING AUTHORIZATION' ? 'var(--status-warning)' : 
                           mission.status === 'ACTIVE' ? 'var(--status-success)' :
                           mission.status === 'REJECTED' || mission.status === 'CANCELLED' ? 'var(--status-danger)' :
                           'var(--text-secondary)',
                    fontSize: '0.75rem',
                    border: '1px solid currentColor'
                  }}>
                    {mission.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>{mission.priority || 'Standard'}</td>
                <td style={{ padding: '16px' }}>
                  <Button variant="secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => navigate(`/planner/missions/${mission.id}`)}>Open</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
