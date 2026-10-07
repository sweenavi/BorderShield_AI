import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { useAuth } from '../context/AuthContext';
import App from './App';

// Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { PlannerLayout } from '../components/layout/PlannerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';


// Auth Pages
import { Login } from '../pages/auth/Login';
import { AccountActivation } from '../pages/auth/AccountActivation';
import { MFA } from '../pages/auth/MFA';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Error Pages
import { AccessDenied } from '../pages/errors/AccessDenied';
import { NotFound } from '../pages/errors/NotFound';
import { SystemError } from '../pages/errors/SystemError';

// Planner Pages
import { PlannerDashboard } from '../pages/mission-planner/PlannerDashboard';
import { MissionsList } from '../pages/mission-planner/MissionsList';
import { CreateMission } from '../pages/mission-planner/CreateMission';
import { MissionDetails } from '../pages/mission-planner/MissionDetails';
import { RouteAnalysis } from '../pages/mission-planner/RouteAnalysis';
import { MissionMonitoring } from '../pages/mission-planner/MissionMonitoring';
import { MissionReport } from '../pages/mission-planner/MissionReport';
import { WeatherIntelligence } from '../pages/mission-planner/WeatherIntelligence';

// Admin Pages
import { AdminDashboard } from '../pages/administrator/AdminDashboard';
import { SystemStatus } from '../pages/administrator/SystemStatus';
import { ReportsRecords } from '../pages/administrator/ReportsRecords';
import { MasterDataManagement } from '../pages/administrator/MasterDataManagement';
import { SecurityAccess } from '../pages/administrator/SecurityAccess';
import { UserManagement } from '../pages/administrator/UserManagement';
import { AuditLogs } from '../pages/administrator/AuditLogs';
import { MissionAuthorization } from '../pages/administrator/MissionAuthorization';
import { MissionOversight } from '../pages/administrator/MissionOversight';
import { AdminProfile } from '../pages/administrator/AdminProfile';

// Shared Pages
import { OperationalMapPage } from '../pages/shared/OperationalMapPage';
import { EnvironmentalConditions } from '../pages/shared/EnvironmentalConditions';
import { RiskAnalysis } from '../pages/shared/RiskAnalysis';
import { Notifications } from '../pages/shared/Notifications';
import { Profile } from '../pages/shared/Profile';
import { SecuritySettings } from '../pages/shared/SecuritySettings';
import { MapCalibrationTool } from '../components/common/MapCalibrationTool';

// ─── Route Guard ─────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.FORBIDDEN} replace />;
  }
  return children;
};

const PLANNER  = 'MISSION PLANNER';
const ADMIN    = 'ADMINISTRATOR';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <SystemError />,
    children: [
      { path: '/', element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },

      // ── Auth ────────────────────────────────────────────────────────────
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.AUTH.LOGIN,          element: <Login /> },
          { path: ROUTES.AUTH.ACTIVATE,        element: <AccountActivation /> },
          { path: ROUTES.AUTH.MFA,             element: <MFA /> },
          { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
          { path: ROUTES.AUTH.RESET_PASSWORD,  element: <ResetPassword /> },
        ]
      },

      // ── Mission Planner ─────────────────────────────────────────────────
      {
        path: '/planner',
        element: <ProtectedRoute allowedRoles={[PLANNER]}><PlannerLayout /></ProtectedRoute>,
        children: [
          { path: 'dashboard',       element: <PlannerDashboard /> },
          { path: 'map',             element: <OperationalMapPage /> },
          { path: 'environmental',   element: <EnvironmentalConditions /> },
          { path: 'weather',         element: <WeatherIntelligence /> },
          { path: 'risk-analysis',   element: <RiskAnalysis /> },
          { path: 'reports',         element: <ReportsRecords /> },
          { path: 'notifications',   element: <Notifications /> },
          { path: 'missions',        element: <MissionsList /> },
          { path: 'missions/create', element: <CreateMission /> },
          {
            path: 'missions/:missionId',
            children: [
              { index: true, element: <MissionDetails /> },
              { path: 'route',   element: <RouteAnalysis /> },
              { path: 'risk',    element: <RiskAnalysis /> },
              { path: 'monitor', element: <MissionMonitoring /> },
              { path: 'report',  element: <MissionReport /> },
            ]
          },
          { path: 'profile',         element: <Profile /> },
          { path: 'security',        element: <SecuritySettings /> },
        ]
      },

      // ── Administrator ───────────────────────────────────────────────────
      {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={[ADMIN]}><AdminLayout /></ProtectedRoute>,
        children: [
          { path: 'dashboard',       element: <AdminDashboard /> },
          { path: 'map',             element: <OperationalMapPage /> },
          { path: 'environmental',   element: <EnvironmentalConditions /> },
          { path: 'risk-analysis',   element: <RiskAnalysis /> },
          { path: 'reports',         element: <ReportsRecords /> },
          { path: 'notifications',   element: <Notifications /> },
          { path: 'missions',        element: <MissionsList /> },
          {
            path: 'missions/:missionId',
            children: [
              { index: true, element: <MissionDetails /> },
              { path: 'route',   element: <RouteAnalysis /> },
              { path: 'risk',    element: <RiskAnalysis /> },
              { path: 'monitor', element: <MissionMonitoring /> },
              { path: 'report',  element: <MissionReport /> },
            ]
          },
          { path: 'system-status',    element: <SystemStatus /> },
          { path: 'master-data',      element: <MasterDataManagement /> },
          { path: 'security-access',  element: <SecurityAccess /> },
          { path: 'users',            element: <UserManagement /> },
          { path: 'audit-logs',       element: <AuditLogs /> },
          { path: 'missions/oversight',    element: <MissionOversight /> },
          { path: 'missions/authorization', element: <MissionAuthorization /> },
          { path: 'map-calibration',  element: <MapCalibrationTool /> },
          { path: 'profile',          element: <AdminProfile /> },
          { path: 'security',         element: <SecuritySettings /> },
        ]
      },

      // ── Error routes ────────────────────────────────────────────────────
      { path: ROUTES.ERROR.FORBIDDEN,  element: <AccessDenied /> },
      { path: ROUTES.ERROR.NOT_FOUND,  element: <NotFound /> },
      { path: '*', element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace /> }
    ]
  }
]);
