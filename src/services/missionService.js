// Mock local storage for missions to simulate a backend DB
// Route results are stored alongside missions so ALL pages read the SAME calculation.

export const missionService = {
  getMissions: () => {
    const missions = localStorage.getItem('bordershield_missions');
    return missions ? JSON.parse(missions) : [];
  },

  getAuditLogs: () => {
    const logs = localStorage.getItem('bordershield_audit_logs');
    return logs ? JSON.parse(logs) : [];
  },

  logAuditAction: (action, details, userRole = 'SYSTEM') => {
    const logs = missionService.getAuditLogs();
    logs.unshift({
      id: `AL-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      userRole
    });
    localStorage.setItem('bordershield_audit_logs', JSON.stringify(logs.slice(0, 50)));
  },

  getMissionById: (id) => {
    const missions = missionService.getMissions();
    return missions.find(m => m.id === id);
  },

  saveMission: (missionData) => {
    const missions = missionService.getMissions();
    const newMission = {
      ...missionData,
      id: missionData.id || `MSN-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: missionData.status || 'DRAFT'
    };

    const existingIndex = missions.findIndex(m => m.id === newMission.id);
    if (existingIndex >= 0) {
      missions[existingIndex] = newMission;
      missionService.logAuditAction('MISSION_UPDATED', `Mission ${newMission.id} updated. Status: ${newMission.status}`);
    } else {
      missions.push(newMission);
      missionService.logAuditAction('MISSION_CREATED', `Mission ${newMission.id} created. Status: ${newMission.status}`);
    }

    localStorage.setItem('bordershield_missions', JSON.stringify(missions));
    return newMission;
  },

  updateMissionStatus: (id, status) => {
    const missions = missionService.getMissions();
    const mission = missions.find(m => m.id === id);
    if (mission) {
      const oldStatus = mission.status;
      mission.status = status;
      localStorage.setItem('bordershield_missions', JSON.stringify(missions));
      missionService.logAuditAction('STATUS_CHANGED', `Mission ${id} status changed from ${oldStatus} to ${status}`);
    }
    return mission;
  },

  // =============================================
  // ROUTE RESULT PERSISTENCE
  // Store the authoritative route calculation so
  // every page reads the EXACT same values.
  // =============================================

  saveRouteResult: (missionId, routeResult) => {
    const results = missionService._getRouteResults();
    results[missionId] = routeResult;
    localStorage.setItem('bordershield_route_results', JSON.stringify(results));
  },

  getRouteResult: (missionId) => {
    const results = missionService._getRouteResults();
    return results[missionId] || null;
  },

  _getRouteResults: () => {
    // V2.2 Cache invalidation for Operational Cost formula fix
    if (!localStorage.getItem('bordershield_v2_2_migration')) {
      localStorage.removeItem('bordershield_route_results');
      localStorage.setItem('bordershield_v2_2_migration', 'done');
    }
    const data = localStorage.getItem('bordershield_route_results');
    return data ? JSON.parse(data) : {};
  }
};
