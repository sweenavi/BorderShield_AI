import { roadMaster } from '../data/roadMaster';

const LOCAL_STORAGE_KEY = 'bordershield_road_status_overrides';

class RoadStatusService {
  constructor() {
    this.overrides = this._loadOverrides();
  }

  _loadOverrides() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load road status overrides', e);
      return {};
    }
  }

  _saveOverrides() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.overrides));
    } catch (e) {
      console.error('Failed to save road status overrides', e);
    }
  }

  getEffectiveRoadStatus(roadId) {
    const override = this.overrides[roadId];
    if (override) {
      return override.status;
    }
    const road = roadMaster.find(r => r.id === roadId);
    return road ? (road.operationalStatus || 'OPEN') : 'OPEN';
  }

  getEffectiveRoad(road) {
    const override = this.overrides[road.id];
    if (override) {
      return { ...road, operationalStatus: override.status };
    }
    return { ...road, operationalStatus: road.operationalStatus || 'OPEN' };
  }

  getAllEffectiveRoads() {
    return roadMaster.map(road => this.getEffectiveRoad(road));
  }

  setRoadStatus(roadId, status, reason = '', updatedBy = 'ADMINISTRATOR') {
    const oldStatus = this.getEffectiveRoadStatus(roadId);
    
    this.overrides[roadId] = {
      status,
      reason,
      updatedBy,
      timestamp: new Date().toISOString()
    };
    this._saveOverrides();
    
    // Log audit event
    try {
      const audits = JSON.parse(localStorage.getItem('bordershield_audit_logs') || '[]');
      audits.push({
        id: `AUDIT-${Date.now()}`,
        type: 'ROAD_STATUS_CHANGED',
        user: updatedBy,
        timestamp: new Date().toISOString(),
        details: `Road ${roadId} status changed from ${oldStatus} to ${status}. Reason: ${reason}`
      });
      localStorage.setItem('bordershield_audit_logs', JSON.stringify(audits));
    } catch (e) {
      console.error('Failed to log audit event', e);
    }
    
    return this.overrides[roadId];
  }

  clearRoadOverride(roadId) {
    delete this.overrides[roadId];
    this._saveOverrides();
  }
}

export const roadStatusService = new RoadStatusService();
