import React from 'react';
import { useParams } from 'react-router-dom';
import { missionService } from '../../services/missionService';
import { weatherService } from '../../services/weatherService';
import { Cloud, Wind, Thermometer, Eye } from 'lucide-react';

export const WeatherIntelligence = () => {
  const { missionId } = useParams();
  const mission = missionService.getMissionById(missionId);

  if (!mission) return <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>MISSION NOT FOUND</div>;

  // Map frozen string values to UI format
  const mapWeatherData = (raw) => {
    if (!raw) return null;
    return {
      condition: raw['Weather Condition'] || 'Clear',
      temperature: typeof raw['Temperature (°C)'] === 'number' ? raw['Temperature (°C)'] : 10,
      snowfall: raw['Snowfall'] === 'Light' ? 5 : raw['Snowfall'] === 'Heavy' ? 25 : 0,
      visibility: raw['Visibility'] === 'Excellent' ? 10000 : raw['Visibility'] === 'Good' ? 5000 : raw['Visibility'] === 'Moderate' ? 2000 : 500,
      windSpeed: typeof raw['Wind Speed (km/h)'] === 'number' ? raw['Wind Speed (km/h)'] : 10
    };
  };

  const destWeather = mapWeatherData(weatherService.getWeatherForNode(mission.destinationId));
  const sourceWeather = mapWeatherData(weatherService.getWeatherForNode(mission.sourceId));

  const WeatherCard = ({ title, weather, node }) => (
    <div style={{ backgroundColor: 'var(--bg-navy)', border: '1px solid var(--border-light)', padding: '24px', flex: 1 }}>
      <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
        {title}: {node}
      </div>
      
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', color: 'var(--accent-cyan)', marginBottom: '24px' }}>
        {weather.condition.toUpperCase()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            <Thermometer size={14}/> TEMPERATURE
          </div>
          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}>{weather.temperature}°C</div>
        </div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            <Cloud size={14}/> SNOWFALL
          </div>
          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}>{weather.snowfall} mm</div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            <Eye size={14}/> VISIBILITY
          </div>
          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}>{weather.visibility} m</div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            <Wind size={14}/> WIND SPEED
          </div>
          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}>{weather.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>METEOROLOGICAL INTELLIGENCE</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>STATIC FROZEN DATA FOR MISSION {missionId}</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {sourceWeather && <WeatherCard title="SOURCE NODE" weather={sourceWeather} node={mission.sourceId} />}
        {destWeather && <WeatherCard title="DESTINATION NODE" weather={destWeather} node={mission.destinationId} />}
      </div>
    </div>
  );
};
