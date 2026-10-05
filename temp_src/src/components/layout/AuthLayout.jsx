import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark-navy)' }}>
      <Outlet />
    </div>
  );
};
