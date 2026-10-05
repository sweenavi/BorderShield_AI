import React, { createContext, useContext, useState, useEffect } from 'react';
import { missionService } from '../services/missionService';

const MissionContext = createContext(null);

export const MissionProvider = ({ children }) => {
  const [missions, setMissions] = useState([]);

  const refreshMissions = () => {
    setMissions(missionService.getMissions());
  };

  useEffect(() => {
    // Seed initial dummy data if local storage is completely empty
    const existing = missionService.getMissions();
    if (existing.length === 0) {
      missionService.saveMission({ id: 'M-1045', missionName: 'Supply Run Alpha', sourceId: 'L01', destinationId: 'CP12', createdAt: new Date().toISOString(), status: 'PENDING AUTHORIZATION', priority: 'High' });
      missionService.saveMission({ id: 'M-1044', missionName: 'Recon Delta', sourceId: 'HP02', destinationId: 'OT03', createdAt: new Date().toISOString(), status: 'ACTIVE', priority: 'Medium' });
      missionService.saveMission({ id: 'M-1043', missionName: 'MedEvac Base', sourceId: 'CP05', destinationId: 'L01', createdAt: new Date().toISOString(), status: 'COMPLETED', priority: 'Critical' });
    }
    refreshMissions();
  }, []);

  return (
    <MissionContext.Provider value={{ missions, refreshMissions }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => useContext(MissionContext);
