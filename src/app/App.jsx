import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { MissionProvider } from '../context/MissionContext';

const App = () => {
  return (
    <AuthProvider>
      <MissionProvider>
        <Outlet />
      </MissionProvider>
    </AuthProvider>
  );
};

export default App;
