import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nodeMaster } from '../../data/nodeMaster';
import { routingService, classifyRisk } from '../../services/routingService';
import { missionService } from '../../services/missionService';
import { weatherService } from '../../services/weatherService';
import { ROUTES } from '../../app/routes';
import { Button } from '../../components/common/Button';
import { OperationalMap } from '../../components/common/OperationalMap';

const MISSION_TYPES = [
  "Personnel Movement", "Border Patrol", "Supply Delivery", "Medical Evacuation", 
  "Engineering Support", "Equipment Transport", "Reconnaissance", "Emergency Response", 
  "Search & Rescue", "VIP Movement", "Routine Inspection"
];

const TRANSPORT_MODES = {
  GROUND: ["Army Truck", "Heavy Convoy", "Light Military Vehicle", "Snow Vehicle", "Engineering Vehicle", "Fuel Tanker", "Ambulance", "Motorcycle Patrol"],
  AIR: ["Utility Helicopter", "Heavy Lift Helicopter", "Medical Helicopter", "Recon Helicopter"],
  PERSONNEL: ["Foot Patrol"]
};
const ALL_TRANSPORT_MODES = [...TRANSPORT_MODES.GROUND, ...TRANSPORT_MODES.AIR, ...TRANSPORT_MODES.PERSONNEL];

const MISSION_TRANSPORT_MAP = {
  "Personnel Movement": ["Foot Patrol", "Army Truck", "Light Military Vehicle", "Utility Helicopter", "Heavy Lift Helicopter"],
  "Border Patrol": ["Foot Patrol", "Light Military Vehicle", "Snow Vehicle", "Motorcycle Patrol", "Recon Helicopter"],
  "Supply Delivery": ["Heavy Convoy", "Army Truck", "Utility Helicopter", "Heavy Lift Helicopter", "Snow Vehicle"],
  "Medical Evacuation": ["Ambulance", "Medical Helicopter", "Utility Helicopter", "Snow Vehicle"],
  "Engineering Support": ["Engineering Vehicle", "Heavy Convoy", "Heavy Lift Helicopter"],
  "Equipment Transport": ["Heavy Convoy", "Army Truck", "Heavy Lift Helicopter"],
  "Reconnaissance": ["Foot Patrol", "Light Military Vehicle", "Motorcycle Patrol", "Recon Helicopter", "Snow Vehicle"],
  "Emergency Response": ["Light Military Vehicle", "Ambulance", "Utility Helicopter", "Medical Helicopter", "Snow Vehicle", "Foot Patrol"],
  "Search & Rescue": ["Utility Helicopter", "Medical Helicopter", "Snow Vehicle", "Foot Patrol", "Recon Helicopter"],
  "VIP Movement": ["Light Military Vehicle", "Utility Helicopter"],
  "Routine Inspection": ["Foot Patrol", "Light Military Vehicle", "Motorcycle Patrol", "Utility Helicopter"]
};

const PRIORITIES = ["Low", "Medium", "High", "Critical", "Emergency"];

const LOAD_TYPES = [
  "Food Supplies", "Medical Supplies", "Fuel", "Engineering Equipment", 
  "Communication Equipment", "Construction Material", "General Cargo", 
  "Emergency Relief Material", "Ammunition (Prototype)", "Mixed Load"
];

const REQUIRES_LOAD_TYPE = [
  "Supply Delivery", "Engineering Support", "Equipment Transport", "Fuel Transport"
];

const EXAMPLES = [
  {
    name: "EXAMPLE 1 — BORDER PATROL",
    data: { sourceId: "CP03", destinationId: "L11", missionType: "Border Patrol", transportMode: "Foot Patrol", missionStrength: "10 Personnel", priority: "High", departureDate: "2026-07-23", departureTime: "08:30", remarks: "Routine patrol with weather monitoring requirement." }
  },
  {
    name: "EXAMPLE 2 — SUPPLY DELIVERY",
    data: { sourceId: "L04", destinationId: "L08", missionType: "Supply Delivery", transportMode: "Heavy Convoy", missionStrength: "5 Vehicles", priority: "High", departureDate: "2026-07-24", departureTime: "06:00", loadType: "Food Supplies", remarks: "" }
  },
  {
    name: "EXAMPLE 3 — MEDICAL EVACUATION",
    data: { sourceId: "L09", destinationId: "HP05", missionType: "Medical Evacuation", transportMode: "Medical Helicopter", missionStrength: "1 Helicopter", priority: "Critical", departureDate: "2026-07-25", departureTime: "12:00", remarks: "" }
  },
  {
    name: "EXAMPLE 4 — ENGINEERING SUPPORT",
    data: { sourceId: "L10", destinationId: "CP06", missionType: "Engineering Support", transportMode: "Engineering Vehicle", missionStrength: "2 Vehicles", priority: "High", departureDate: "2026-07-26", departureTime: "09:00", loadType: "Engineering Equipment", remarks: "" }
  },
  {
    name: "EXAMPLE 5 — SEARCH & RESCUE",
    data: { sourceId: "L16", destinationId: "RP06", missionType: "Search & Rescue", transportMode: "Utility Helicopter", missionStrength: "1 Helicopter", priority: "Emergency", departureDate: "2026-07-27", departureTime: "14:00", remarks: "" }
  }
];

export const CreateMission = () => {
  const navigate = useNavigate();
  // Filter out junctions
  const selectableNodes = nodeMaster.filter(n => n.type !== 'J' && !n.reserved);

  const [formData, setFormData] = useState({
    sourceId: '',
    destinationId: '',
    missionType: '',
    transportMode: '',
    priority: '',
    missionStrength: '',
    departureDate: '',
    departureTime: '',
    loadType: '',
    remarks: ''
  });

  const [routeResult, setRouteResult] = useState(null);
  const [savedMissionId, setSavedMissionId] = useState(null);
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destWeather, setDestWeather] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    
    // Conditional logic handling
    if (name === 'missionType') {
      if (!REQUIRES_LOAD_TYPE.includes(value)) {
        newData.loadType = '';
      }
      if (value && MISSION_TRANSPORT_MAP[value] && !MISSION_TRANSPORT_MAP[value].includes(newData.transportMode)) {
        newData.transportMode = '';
        newData.missionStrength = '';
      }
    } else if (name === 'transportMode') {
      newData.missionStrength = '';
    }
    
    setFormData(newData);
  };

  const loadExample = (exampleData) => {
    setFormData({
      sourceId: exampleData.sourceId || '',
      destinationId: exampleData.destinationId || '',
      missionType: exampleData.missionType || '',
      transportMode: exampleData.transportMode || '',
      priority: exampleData.priority || '',
      missionStrength: exampleData.missionStrength || '',
      departureDate: exampleData.departureDate || '',
      departureTime: exampleData.departureTime || '',
      loadType: exampleData.loadType || '',
      remarks: exampleData.remarks || ''
    });
  };

  const mapWeatherData = (raw) => {
    if (!raw) return null;
    return {
      condition: raw['Weather Condition'] || 'Clear',
      temperature: typeof raw['Temperature (°C)'] === 'number' ? raw['Temperature (°C)'] : 10,
    };
  };

  useEffect(() => {
    if (formData.sourceId) setSourceWeather(mapWeatherData(weatherService.getWeatherForNode(formData.sourceId)));
    if (formData.destinationId) setDestWeather(mapWeatherData(weatherService.getWeatherForNode(formData.destinationId)));
  }, [formData.sourceId, formData.destinationId]);

  const handleCalculateRoute = () => {
    if (!formData.sourceId || !formData.destinationId) return alert('Source and Destination required.');
    if (formData.sourceId === formData.destinationId) return alert('Source cannot be the same as Destination.');
    if (!formData.missionType) return alert('Mission Type required.');
    if (!formData.transportMode) return alert('Transport Mode required.');
    if (!formData.priority) return alert('Priority required.');
    if (!formData.missionStrength) return alert('Mission Strength required.');
    if (!formData.departureDate) return alert('Departure Date required.');
    if (!formData.departureTime) return alert('Departure Time required.');
    if (REQUIRES_LOAD_TYPE.includes(formData.missionType) && !formData.loadType) return alert('Load Type required for this mission type.');

    // Only submit applicable payload
    const submissionData = { ...formData };
    if (!REQUIRES_LOAD_TYPE.includes(submissionData.missionType)) {
      delete submissionData.loadType;
    }

    const result = routingService.calculateRoute(formData.sourceId, formData.destinationId, submissionData);
    if (!result) return alert('No feasible route found.');

    const saved = missionService.saveMission({ ...submissionData, status: 'DRAFT' });
    missionService.saveRouteResult(saved.id, result);
    setSavedMissionId(saved.id);
    setRouteResult(result);
  };

  const handleSaveDraft = () => {
    if (!savedMissionId) return alert('Calculate route first.');
    const submissionData = { ...formData };
    if (!REQUIRES_LOAD_TYPE.includes(submissionData.missionType)) delete submissionData.loadType;

    const saved = missionService.saveMission({ ...submissionData, id: savedMissionId, status: 'DRAFT' });
    if (routeResult) missionService.saveRouteResult(saved.id, routeResult);
    navigate(ROUTES.PLANNER.MISSIONS);
  };

  const handleViewFullAnalysis = () => {
    if (!savedMissionId) return alert('Please calculate route first.');
    navigate(`/planner/missions/${savedMissionId}/route`);
  };

  const inputStyle = { width: '100%', padding: '8px', backgroundColor: 'var(--bg-dark-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' };
  const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em', marginBottom: '8px', color: 'var(--text-secondary)', textTransform: 'uppercase' };
  const sectionHeaderStyle = { fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', marginBottom: '16px', marginTop: '24px' };

  const rec = routeResult?.recommended;
  const isLoadTypeApplicable = REQUIRES_LOAD_TYPE.includes(formData.missionType);
  
  // Compute Strength label and options
  let strengthLabel = "MISSION STRENGTH";
  let strengthOptions = [];
  if (formData.transportMode === 'Foot Patrol') {
    strengthLabel = "MISSION STRENGTH (PERSONNEL)";
    strengthOptions = ["2 Personnel", "4 Personnel", "6 Personnel", "10 Personnel", "20 Personnel", "30 Personnel", "50 Personnel", "75 Personnel", "100 Personnel"];
  } else if (TRANSPORT_MODES.GROUND.includes(formData.transportMode)) {
    strengthLabel = "MISSION STRENGTH (VEHICLES)";
    strengthOptions = ["1 Vehicle", "2 Vehicles", "5 Vehicles", "10 Vehicles", "15 Vehicles", "20 Vehicles"];
  } else if (TRANSPORT_MODES.AIR.includes(formData.transportMode)) {
    strengthLabel = "MISSION STRENGTH (HELICOPTERS)";
    strengthOptions = ["1 Helicopter", "2 Helicopters", "3 Helicopters"];
  }

  // Filter transport modes based on mission type
  const allowedTransports = formData.missionType && MISSION_TRANSPORT_MAP[formData.missionType] 
    ? MISSION_TRANSPORT_MAP[formData.missionType] 
    : ALL_TRANSPORT_MODES;
    
  const groundTransports = TRANSPORT_MODES.GROUND.filter(t => allowedTransports.includes(t));
  const airTransports = TRANSPORT_MODES.AIR.filter(t => allowedTransports.includes(t));
  const personnelTransports = TRANSPORT_MODES.PERSONNEL.filter(t => allowedTransports.includes(t));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '24px' }}>
      <div style={{ flex: '2', backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>CREATE MISSION</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>OPERATIONAL PARAMETER INITIALIZATION</p>
          </div>
          <div>
            <select onChange={(e) => {
              if (e.target.value) {
                loadExample(EXAMPLES[e.target.value].data);
                e.target.value = "";
              }
            }} style={{ ...inputStyle, width: 'auto', padding: '4px 8px', fontSize: '0.6875rem' }}>
              <option value="">-- LOAD EXAMPLE MISSION --</option>
              {EXAMPLES.map((ex, idx) => (
                <option key={idx} value={idx}>{ex.name}</option>
              ))}
            </select>
          </div>
        </div>

        <h3 style={{...sectionHeaderStyle, marginTop: 0}}>OPERATIONAL NODES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
        </div>

        <h3 style={sectionHeaderStyle}>MISSION DEFINITION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>MISSION TYPE</label>
            <select name="missionType" value={formData.missionType} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              {MISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>TRANSPORT MODE</label>
            <select name="transportMode" value={formData.transportMode} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              {groundTransports.length > 0 && (
                <optgroup label="GROUND">
                  {groundTransports.map(t => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              )}
              {airTransports.length > 0 && (
                <optgroup label="AIR">
                  {airTransports.map(t => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              )}
              {personnelTransports.length > 0 && (
                <optgroup label="PERSONNEL">
                  {personnelTransports.map(t => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              )}
            </select>
          </div>
          <div>
            <label style={labelStyle}>PRIORITY</label>
            <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle}>
              <option value="">SELECT...</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{strengthLabel}</label>
            <select name="missionStrength" value={formData.missionStrength} onChange={handleChange} style={inputStyle} disabled={!strengthOptions.length}>
              <option value="">{strengthOptions.length ? "SELECT..." : "SELECT TRANSPORT FIRST"}</option>
              {strengthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {isLoadTypeApplicable && (
          <>
            <h3 style={sectionHeaderStyle}>LOGISTICS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>LOAD TYPE</label>
                <select name="loadType" value={formData.loadType} onChange={handleChange} style={inputStyle}>
                  <option value="">SELECT...</option>
                  {LOAD_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </>
        )}

        <h3 style={sectionHeaderStyle}>SCHEDULING & REMARKS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>DEPARTURE DATE</label>
            <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>DEPARTURE TIME</label>
            <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>MISSION REMARKS (OPTIONAL)</label>
            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} style={inputStyle} placeholder="ENTER ANY OPERATIONAL NOTES..." />
          </div>
        </div>
      </div>

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
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>RECOMMENDED ROUTE</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{rec.path.filter(id => !id.startsWith('J')).join(' → ')}</div>
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
              <div style={{ flex: 1, minHeight: '200px', border: '1px solid var(--border-medium)' }}>
                <OperationalMap routeSegments={rec.segments} highlightNodes={[formData.sourceId, formData.destinationId]} interactive={true} />
              </div>
              <Button variant="primary" onClick={handleViewFullAnalysis} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>VIEW FULL ROUTE ANALYSIS</Button>
            </div>
          ) : (
            <div style={{ flex: 1, minHeight: '200px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '16px' }}>AWAITING ROUTE CALCULATION</div>
              <div style={{ flex: 1 }}>
                <OperationalMap routeSegments={[]} highlightNodes={[formData.sourceId, formData.destinationId]} interactive={true} />
              </div>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '16px' }}>
           <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-medium)', paddingBottom: '8px', margin: '0 0 16px 0' }}>ACTIONS</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <Button variant="secondary" onClick={handleCalculateRoute} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>CALCULATE ROUTE</Button>
             <Button variant="secondary" onClick={handleSaveDraft} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>SAVE DRAFT</Button>
             <Button variant="primary" onClick={() => {
               if (!savedMissionId) return alert('Calculate route and save draft first.');
               missionService.updateMissionStatus(savedMissionId, 'PENDING AUTHORIZATION');
               navigate(ROUTES.PLANNER.MISSIONS);
             }} style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}>SUBMIT FOR AUTHORIZATION</Button>
           </div>
        </div>
      </div>
    </div>
  );
};
