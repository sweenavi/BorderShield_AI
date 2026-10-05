import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { ROUTES } from '../../app/routes';

export const MissionDetails = () => {
  const { missionId } = useParams();
  const mission = missionService.getMissionById(missionId);

  if (!mission) {
    return <Navigate to={ROUTES.PLANNER.MISSIONS} />;
  }

  // Smart routing based on status
  if (mission.status === 'ACTIVE') {
    return <Navigate to={`/planner/missions/${missionId}/monitor`} />;
  }
  if (mission.status === 'COMPLETED') {
    return <Navigate to={`/planner/missions/${missionId}/report`} />;
  }
  
  return <Navigate to={`/planner/missions/${missionId}/route`} />;
};
