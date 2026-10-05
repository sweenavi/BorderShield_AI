import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { nodeMaster } from '../../data/nodeMaster';
import { mapNodeCoordinates as initialCoords } from '../../data/mapNodeCoordinates';
import { LEAFLET_BOUNDS, leafletToImagePixel, imagePixelToLeaflet } from '../../utils/mapCoordinates';

// Fix Leaflet default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export const MapCalibrationTool = () => {
  const [coords, setCoords] = useState({ ...initialCoords });
  const [calibratedNodes, setCalibratedNodes] = useState(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState('');
  
  // Exclude junctions if they shouldn't be calibrated, but actually junctions might need it. The instructions said 69 nodes total (including 15 junctions). So all nodeMaster nodes.
  const allNodes = nodeMaster.filter(n => !n.reserved);
  
  const progress = Math.round((calibratedNodes.size / allNodes.length) * 100);

  const handleMapClick = (latlng) => {
    if (!selectedNodeId) return;
    const { x, y } = leafletToImagePixel(latlng.lat, latlng.lng);
    
    setCoords(prev => ({
      ...prev,
      [selectedNodeId]: { x, y }
    }));
    
    setCalibratedNodes(prev => {
      const next = new Set(prev);
      next.add(selectedNodeId);
      return next;
    });
  };

  const handleNextUncalibrated = () => {
    const next = allNodes.find(n => !calibratedNodes.has(n.id));
    if (next) setSelectedNodeId(next.id);
  };

  const handleReset = () => {
    if (!selectedNodeId) return;
    setCoords(prev => ({
      ...prev,
      [selectedNodeId]: initialCoords[selectedNodeId] || { x: 0, y: 0 }
    }));
    setCalibratedNodes(prev => {
      const next = new Set(prev);
      next.delete(selectedNodeId);
      return next;
    });
  };

  const handleExport = () => {
    const output = `export const mapNodeCoordinates = ${JSON.stringify(coords, null, 2)};\n`;
    navigator.clipboard.writeText(output).then(() => {
      alert('mapNodeCoordinates.js content copied to clipboard!');
    });
  };

  const createCrosshairIcon = (color) => new L.DivIcon({
    className: 'custom-icon',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="position: absolute; top: 11px; left: 0; width: 24px; height: 2px; background-color: ${color};"></div>
        <div style="position: absolute; top: 0; left: 11px; width: 2px; height: 24px; background-color: ${color};"></div>
        <div style="position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; border: 2px solid ${color}; border-radius: 50%; box-sizing: border-box;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  const createDotIcon = (color) => new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 10px; height: 10px; border: 1px solid white; border-radius: 50%;"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  const selectedNodeOrig = initialCoords[selectedNodeId];
  const selectedNodeCurr = coords[selectedNodeId];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#060B12', color: '#F0F4F8', fontFamily: 'monospace' }}>
      
      {/* Sidebar Controls */}
      <div style={{ width: '320px', padding: '20px', borderRight: '1px solid #253D54', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '16px', color: '#00E5FF', margin: 0 }}>MAP CALIBRATION</h2>
        
        <div style={{ backgroundColor: '#0D1B2A', padding: '12px', border: '1px solid #253D54' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>PROGRESS:</span>
            <span style={{ color: '#00E5FF' }}>{calibratedNodes.size} / {allNodes.length} ({progress}%)</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#253D54' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#00E5FF' }}></div>
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#8FAAB8' }}>SELECT NODE</label>
          <select 
            value={selectedNodeId} 
            onChange={(e) => setSelectedNodeId(e.target.value)}
            style={{ width: '100%', padding: '8px', backgroundColor: '#0D1B2A', color: '#F0F4F8', border: '1px solid #253D54', fontFamily: 'monospace' }}
          >
            <option value="">-- SELECT --</option>
            {allNodes.map(n => (
              <option key={n.id} value={n.id}>
                {calibratedNodes.has(n.id) ? '✓ ' : ''}{n.id} - {n.name}
              </option>
            ))}
          </select>
        </div>

        {selectedNodeId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#0D1B2A', border: '1px solid #253D54' }}>
              <div style={{ fontSize: '11px', color: '#8FAAB8', marginBottom: '4px' }}>ORIGINAL COORDINATE:</div>
              <div style={{ color: '#F59E0B' }}>
                {selectedNodeOrig ? `X: ${selectedNodeOrig.x}, Y: ${selectedNodeOrig.y}` : '---'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#0D1B2A', border: '1px solid #253D54' }}>
              <div style={{ fontSize: '11px', color: '#8FAAB8', marginBottom: '4px' }}>NEW COORDINATE:</div>
              <div style={{ color: '#22C55E', fontWeight: 'bold' }}>
                {selectedNodeCurr ? `X: ${selectedNodeCurr.x}, Y: ${selectedNodeCurr.y}` : '---'}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleReset}
                style={{ flex: 1, padding: '8px', backgroundColor: '#0D1B2A', color: '#F59E0B', border: '1px solid #F59E0B', cursor: 'pointer', fontFamily: 'monospace' }}
              >
                RESET
              </button>
              <button 
                onClick={handleNextUncalibrated}
                style={{ flex: 1, padding: '8px', backgroundColor: '#0D1B2A', color: '#00E5FF', border: '1px solid #00E5FF', cursor: 'pointer', fontFamily: 'monospace' }}
              >
                NEXT UNCALIBRATED
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={handleExport}
          style={{ marginTop: 'auto', padding: '12px', backgroundColor: '#00E5FF', color: '#060B12', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
        >
          EXPORT mapNodeCoordinates.js
        </button>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          bounds={LEAFLET_BOUNDS}
          crs={L.CRS.Simple}
          minZoom={-1}
          maxZoom={3}
          style={{ height: '100%', width: '100%', cursor: selectedNodeId ? 'crosshair' : 'grab' }}
        >
          <ImageOverlay url="/map.png" bounds={LEAFLET_BOUNDS} opacity={1.0} />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Render all nodes lightly */}
          {allNodes.map(node => {
            const coord = coords[node.id];
            if (!coord) return null;
            const isSelected = node.id === selectedNodeId;
            const isCalibrated = calibratedNodes.has(node.id);
            
            if (isSelected) {
              return (
                <Marker 
                  key={node.id} 
                  position={imagePixelToLeaflet(coord.x, coord.y)}
                  icon={createCrosshairIcon('#00E5FF')}
                  zIndexOffset={1000}
                >
                  <Popup closeButton={false}>
                    <div style={{ color: 'black', fontWeight: 'bold' }}>{node.id}</div>
                  </Popup>
                </Marker>
              );
            } else {
              return (
                <Marker 
                  key={node.id} 
                  position={imagePixelToLeaflet(coord.x, coord.y)}
                  icon={createDotIcon(isCalibrated ? '#22C55E' : '#EF4444')}
                  zIndexOffset={isCalibrated ? 100 : 200}
                >
                  <Popup closeButton={false}>
                    <div style={{ color: 'black', fontWeight: 'bold' }}>{node.id}</div>
                  </Popup>
                </Marker>
              );
            }
          })}
        </MapContainer>
      </div>
    </div>
  );
};
