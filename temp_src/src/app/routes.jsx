export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    ACTIVATE: '/auth/activate',
    MFA: '/auth/mfa',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PLANNER: {
    DASHBOARD: '/planner/dashboard',
    MISSIONS: '/planner/missions',
    CREATE_MISSION: '/planner/missions/create',
    MISSION_DETAILS: '/planner/missions/:missionId',
    ROUTE_ANALYSIS: '/planner/missions/:missionId/route',
    WEATHER: '/planner/missions/:missionId/weather',
    MONITOR: '/planner/missions/:missionId/monitor',
    REPORT: '/planner/missions/:missionId/report',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    AUTHORIZATION: '/admin/missions/authorization',
    OVERSIGHT: '/admin/missions/oversight',
    USERS: '/admin/users',
    AUDIT_LOGS: '/admin/audit-logs',
    SYSTEM_STATUS: '/admin/system-status',
    REPORTS: '/admin/reports',
    PROFILE: '/admin/profile',
  },
  SHARED: {
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
    SECURITY: '/security',
  },
  ERROR: {
    FORBIDDEN: '/403',
    NOT_FOUND: '/404',
    SYSTEM_ERROR: '/500',
  }
};
