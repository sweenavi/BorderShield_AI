import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nodeMaster } from '../../data/nodeMaster';
import { routingService, classifyRisk } from '../../services/routingService';
import { missionService } from '../../services/missionService';
import { weatherService } from '../../services/weatherService';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button';
import { OperationalMap } from '../../components/common/OperationalMap';

export const CreateMission = () => {
  const navigate = useNavigate();
  const selectableNodes = nodeMaster.filter(n => n.type !== 'J' && !n.reserved);

  const [formData, setFormData] = useState({
    missionName: '',
    sourceId: '',
    destinationId: '',
    checkpointId: '',
    missionType: '',
    priority: '',
    vehicleType: '',
    vehicleCount: 1,
    payload: '',
    movementConstraints: '',
    requiredArrivalTime: '',
    safetyPriority: 'Balanced',
    etaConstraint: 'Flexible',
    roadRestrictions: 'None'
  });

  const [routeResult, setRouteResult] = useState(null);
  const [savedMissionId, setSavedMissionId] = useState(null);
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destWeather, setDestWeather] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (formData.sourceId) setSourceWeather(weatherService.getWeatherForNode(formData.sourceId));
    if (formData.destinationId) setDestWeather(weatherService.getWeatherForNode(formData.destinationId));
  }, [formData.sourceId, formData.destinationId]);

  const handleCalculateRoute = () => {
    if (!formData.sourceId || !formData.destinationId) return alert('Source and Destination required.');

    // ONE authoritative calculation
    const result = routingService.calculateRoute(formData.sourceId, formData.destinationId, formData);
    if (!result) return alert('No feasible route found.');

    // Save mission and store route result
    const saved = missionService.saveMission({ ...formData, status: 'DRAFT' });
    missionService.saveRouteResult(saved.id, result);
    setSavedMissionId(saved.id);
    setRouteResult(result);
  };

  const handleSaveDraft = () => {
    const saved = missionService.saveMission({ ...formData, id: savedMissionId, status: 'DRAFT' });
    if (routeResult) missionService.saveRouteResult(saved.id, routeResult);
    navigate(ROUTES.PLANNER.MISSIONS);
  };

  const handleViewFullAnalysis = () => {
    if (!savedMissionId) return alert('Please calculate route first.');
    navigate(`/planner/missions/${savedMissionId}/route`);
  };

  const inputStyle = { width: '100%', padding: '8px', backgroundColor: 'var(--bg-dark-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' };
  const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em', marginBottom: '8px', color: 'var(--text-secondary)' };
  const sectionHeaderStyle = { fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', marginBottom: '16px', marginTop: '24px' };

  const rec = routeResult?.recommended;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '24px' }}>

      {/* Left Column: Form Inputs */}
      <div style={{ flex: '2', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>CREATE MISSION</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>OPERATIONAL PARAMETER INITIALIZATION</p>

        <h3 style={sectionHeaderStyle}>MISSION INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>MISSION NAME</label>
            <input type="text" name="missionName" value={formData.missionName} onChange={handleChange} style={inputStyle} placeholder="E.G. ALPHA-RESUPPLY" />
          </div>
          <div>
            <label style={labelStyle}>MISSION TYPE</label>
            <select name="missionType" value={formData.missionType} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              <option value="Personnel Movement">Personnel Movement</option>
              <option value="Border Patrol">Border Patrol</option>
              <option value="Supply Delivery">Supply Delivery</option>
              <option value="Medical Evacuation">Medical Evacuation</option>
              <option value="Engineering Support">Engineering Support</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>PRIORITY</label>
            <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <h3 style={sectionHeaderStyle}>SOURCE & DESTINATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>SOURCE</label>
            <select name="sourceId" value={formData.sourceId} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT SOURCE...</option>
              {selectableNodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>DESTINATION</label>
            <select name="destinationId" value={formData.destinationId} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT DESTINATION...</option>
              {selectableNodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>CHECKPOINT (OPTIONAL)</label>
            <select name="checkpointId" value={formData.checkpointId} onChange={handleChange} style={inputStyle}>
              <option value="">NONE</option>
              {selectableNodes.filter(n => n.type === 'CP').map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
          </div>
        </div>

        <h3 style={sectionHeaderStyle}>MISSION PARAMETERS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>VEHICLE TYPE</label>
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              <option value="Light Utility Vehicle">Light Utility Vehicle</option>
              <option value="Heavy Logistics Convoy">Heavy Logistics Convoy</option>
              <option value="Armored Carrier">Armored Carrier</option>
              <option value="Rotary Wing (Heli)">Rotary Wing (Heli)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>VEHICLE COUNT</label>
            <input type="number" min="1" name="vehicleCount" value={formData.vehicleCount} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PAYLOAD / LOAD</label>
            <input type="text" name="payload" value={formData.payload} onChange={handleChange} style={inputStyle} placeholder="E.G. 500KG RATIONS" />
          </div>
          <div>
            <label style={labelStyle}>REQUIRED ARRIVAL (UTC)</label>
            <input type="datetime-local" name="requiredArrivalTime" value={formData.requiredArrivalTime} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <h3 style={sectionHeaderStyle}>ROUTING PREFERENCES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>SAFETY PRIORITY</label>
            <select name="safetyPriority" value={formData.safetyPriority} onChange={handleChange} style={inputStyle}>
              <option value="Balanced">Balanced (Default)</option>
              <option value="Minimize Risk">Minimize Operational Risk</option>
              <option value="Minimize Time">Minimize Travel Time</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>ROAD RESTRICTIONS</label>
            <select name="roadRestrictions" value={formData.roadRestrictions} onChange={handleChange} style={inputStyle}>
              <option value="None">None</option>
              <option value="Paved Only">Paved Only</option>
              <option value="Avoid Ice/Snow">Avoid Ice/Snow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Column: Environment, Preview & Actions */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
          <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', margin: '0 0 16px 0' }}>CURRENT ENVIRONMENT</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>SOURCE WEATHER</div>
              {sourceWeather ? (
                <div style={{ color: 'var(--text-primary)' }}>{sourceWeather.temperature}°C, {sourceWeather.condition.toUpperCase()}</div>
              ) : <div style={{ color: 'var(--text-muted)' }}>SELECT SOURCE</div>}
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>DESTINATION WEATHER</div>
              {destWeather ? (
                <div style={{ color: 'var(--text-primary)' }}>{destWeather.temperature}°C, {destWeather.condition.toUpperCase()}</div>
              ) : <div style={{ color: 'var(--text-muted)' }}>SELECT DESTINATION</div>}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', margin: '0 0 16px 0' }}>ROUTE PREVIEW</h3>

          {rec ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              {/* Summary row */}
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                RECOMMENDED ROUTE
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                {rec.path.filter(id => !id.startsWith('J')).join(' → ')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>DISTANCE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>{rec.metrics.totalDistance} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KM</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>ETA</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>{Math.floor(rec.metrics.totalETA / 60)}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>H</span> {Math.round(rec.metrics.totalETA % 60)}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>M</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>MCREE OPERATIONAL RISK</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: rec.metrics.riskClassification.color }}>{rec.metrics.averageRisk} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>CLASSIFICATION</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: rec.metrics.riskClassification.color }}>{rec.metrics.riskClassification.label}</div>
                </div>
              </div>

              {/* Small map preview */}
              <div style={{ flex: 1, minHeight: '200px', border: '1px solid var(--border-medium)' }}>
                <OperationalMap
                  routeSegments={rec.segments}
                  highlightNodes={[formData.sourceId, formData.destinationId]}
                  interactive={true}
                />
              </div>

              <Button variant="primary" onClick={handleViewFullAnalysis} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>VIEW FULL ROUTE ANALYSIS</Button>
            </div>
          ) : (
            <div style={{ flex: 1, minHeight: '200px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '16px' }}>
                AWAITING ROUTE CALCULATION
              </div>
              <div style={{ flex: 1 }}>
                <OperationalMap
                  routeSegments={[]}
                  highlightNodes={[formData.sourceId, formData.destinationId]}
                  interactive={true}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
           <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', margin: '0 0 16px 0' }}>ACTIONS</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <Button variant="secondary" onClick={handleCalculateRoute} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>CALCULATE ROUTE</Button>
             <Button variant="secondary" onClick={handleSaveDraft} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>SAVE DRAFT</Button>
           </div>
        </div>

      </div>

    </div>
  );
};
