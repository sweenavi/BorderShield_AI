import React, { createContext, useContext, useState } from 'react';
import { missionService } from '../services/missionService';

const AuthContext = createContext(null);

export const ROLES = {
  MISSION_PLANNER: 'MISSION PLANNER',
  ADMINISTRATOR:   'ADMINISTRATOR',
};

// Role → home route after login
export const ROLE_HOME = {
  'MISSION PLANNER': '/planner/dashboard',
  'ADMINISTRATOR':   '/admin/dashboard',
};

// Role → layout prefix
export const ROLE_PREFIX = {
  'MISSION PLANNER': '/planner',
  'ADMINISTRATOR':   '/admin',
};

const DEMO_USERS = {
  admin:   { id: 'ADM-001', name: 'Rajesh Kumar',    email: 'admin@bordershield.local',   role: ROLES.ADMINISTRATOR   },
  planner: { id: 'PLN-001', name: 'Vikram Singh',    email: 'planner@bordershield.local', role: ROLES.MISSION_PLANNER },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bordershield_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (roleKey = 'planner') => {
    const newUser = DEMO_USERS[roleKey] || DEMO_USERS.planner;
    setUser(newUser);
    localStorage.setItem('bordershield_auth', JSON.stringify(newUser));
    missionService.logAuditAction('USER_LOGIN', `${newUser.name} (${newUser.role}) logged in via MFA.`, newUser.role);
  };

  const logout = () => {
    if (user) {
      missionService.logAuditAction('USER_LOGOUT', `${user.name} logged out.`, user.role);
    }
    setUser(null);
    localStorage.removeItem('bordershield_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ROLES, ROLE_HOME, ROLE_PREFIX }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
