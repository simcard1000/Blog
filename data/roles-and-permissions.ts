export const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export type Role = keyof typeof ROLES;

// Admin Roles for specialized admin tasks
export const ADMIN_ROLES = {
  GENERAL_ADMIN: 'GENERAL_ADMIN',       // General admin tasks
  CONTENT_MODERATOR: 'CONTENT_MODERATOR', // Manages content, blog, reviews
  CUSTOMER_SUPPORT: 'CUSTOMER_SUPPORT', // Handles customer issues and disputes
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',         // Technical system management
} as const;

export type AdminRole = keyof typeof ADMIN_ROLES;


// Admin Notification Types
export const ADMIN_NOTIFICATION_TYPES = {
  SELLER_APPLICATION_SUBMITTED: 'SELLER_APPLICATION_SUBMITTED',
  SELLER_APPLICATION_APPROVED: 'SELLER_APPLICATION_APPROVED',
  SELLER_APPLICATION_REJECTED: 'SELLER_APPLICATION_REJECTED',
  CUSTOMER_DISPUTE_CREATED: 'CUSTOMER_DISPUTE_CREATED',
  REFUND_REQUEST_SUBMITTED: 'REFUND_REQUEST_SUBMITTED',
  CONTENT_FLAGGED: 'CONTENT_FLAGGED',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
  FINANCIAL_ALERT: 'FINANCIAL_ALERT',
  USER_SUSPENSION_REQUEST: 'USER_SUSPENSION_REQUEST',
  GENERAL_ADMIN_NOTIFICATION: 'GENERAL_ADMIN_NOTIFICATION',
} as const;

export type AdminNotificationType = keyof typeof ADMIN_NOTIFICATION_TYPES;

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: { value: 'MANAGE_USERS', group: 'User Management', label: 'Manage Users' },
  VIEW_USERS: { value: 'VIEW_USERS', group: 'User Management', label: 'View Users' },
  DELETE_USERS: { value: 'DELETE_USERS', group: 'User Management', label: 'Delete Users' },
  SUSPEND_USERS: { value: 'SUSPEND_USERS', group: 'User Management', label: 'Suspend Users' },
  MANAGE_PERMISSIONS: { value: 'MANAGE_PERMISSIONS', group: 'User Management', label: 'Manage Permissions' },
  MANAGE_ROLES: { value: 'MANAGE_ROLES', group: 'User Management', label: 'Manage User Roles' },

  // Dashboard Access
  ACCESS_ADMIN_DASHBOARD: { value: 'ACCESS_ADMIN_DASHBOARD', group: 'Dashboard Access', label: 'Access Admin Dashboard' },
  ACCESS_MEMBER_DASHBOARD: { value: 'ACCESS_MEMBER_DASHBOARD', group: 'Dashboard Access', label: 'Access Member Dashboard' },
  
  // Content Management
  MANAGE_CONTENT: { value: 'MANAGE_CONTENT', group: 'Content Management', label: 'Manage Content' },
  WRITE_BLOG: { value: 'WRITE_BLOG', group: 'Content Management', label: 'Write Blog' },
  PUBLISH_BLOG: { value: 'PUBLISH_BLOG', group: 'Content Management', label: 'Publish Blog' },
  DELETE_BLOG: { value: 'DELETE_BLOG', group: 'Content Management', label: 'Delete Blog' },
  MANAGE_COMMENTS: { value: 'MANAGE_COMMENTS', group: 'Content Management', label: 'Manage Comments' },
  
  // System Management
  MANAGE_SYSTEM: { value: 'MANAGE_SYSTEM', group: 'System Management', label: 'Manage System' },
  VIEW_LOGS: { value: 'VIEW_LOGS', group: 'System Management', label: 'View Logs' },
  MANAGE_ADMIN_SETTINGS: { value: 'MANAGE_ADMIN_SETTINGS', group: 'System Management', label: 'Manage Admin Settings' },
  MANAGE_MEMBER_SETTINGS: { value: 'MANAGE_MEMBER_SETTINGS', group: 'System Management', label: 'Manage Member Settings' },
  MANAGE_POLICIES: { value: 'MANAGE_POLICIES', group: 'System Management', label: 'Manage Policies' },
  
  // Analytics
  VIEW_ANALYTICS: { value: 'VIEW_ANALYTICS', group: 'Analytics', label: 'View Analytics' },
  EXPORT_ANALYTICS: { value: 'EXPORT_ANALYTICS', group: 'Analytics', label: 'Export Analytics' },
  VIEW_ONBOARDING_SURVEYS: { value: 'VIEW_ONBOARDING_SURVEYS', group: 'Analytics', label: 'View Onboarding Surveys' },
  
  // Fraud Detection
  VIEW_FRAUD_DETECTION: { value: 'VIEW_FRAUD_DETECTION', group: 'Fraud Detection', label: 'View Fraud Detection Events' },
  MANAGE_FRAUD_DETECTION: { value: 'MANAGE_FRAUD_DETECTION', group: 'Fraud Detection', label: 'Manage Fraud Detection Events' },
  CREATE_FRAUD_EVENTS: { value: 'CREATE_FRAUD_EVENTS', group: 'Fraud Detection', label: 'Create Fraud Detection Events' },
  
  // Communication
  MANAGE_MESSAGES: { value: 'MANAGE_MESSAGES', group: 'Communication', label: 'Manage Messages' },
  SEND_BROADCASTS: { value: 'SEND_BROADCASTS', group: 'Communication', label: 'Send Broadcasts' },
  MANAGE_NOTIFICATIONS: { value: 'MANAGE_NOTIFICATIONS', group: 'Communication', label: 'Manage Notifications' }
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Helper function to get permission value
export const getPermissionValue = (permission: Permission): string => {
  return PERMISSIONS[permission].value;
};

// Helper function to get all permission values
export const getPermissionValues = (): string[] => {
  return Object.values(PERMISSIONS).map(p => p.value);
};

// Helper function to group permissions
export const getPermissionGroups = () => {
  const groups: Record<string, { value: string; label: string }[]> = {};
  
  Object.entries(PERMISSIONS).forEach(([key, permission]) => {
    const group = permission.group;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push({
      value: permission.value,
      label: permission.label
    });
  });
  
  return groups;
};

// Default role permissions mapping (using permission values)
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    'MANAGE_USERS',
    'VIEW_USERS',
    'ACCESS_ADMIN_DASHBOARD',
    'MANAGE_CONTENT',
    'WRITE_BLOG',
    'PUBLISH_BLOG',
    'DELETE_BLOG',
    'MANAGE_COMMENTS',
    'WRITE_HELP_ARTICLES',
    'PUBLISH_HELP_ARTICLES',
    'DELETE_HELP_ARTICLES',
    'MANAGE_HELP_CATEGORIES',
    'MANAGE_PRODUCTS',
    'MANAGE_ORDERS',
    'VIEW_ORDERS',
    'PROCESS_ORDERS',
    'REFUND_ORDERS',
    'MANAGE_SELLERS',
    'APPROVE_SELLERS',
    'SUSPEND_SELLERS',
    'VIEW_SELLER_APPLICATIONS',
    'MANAGE_SYSTEM',
    'VIEW_LOGS',
    'MANAGE_ADMIN_SETTINGS',
    'VIEW_ANALYTICS',
    'VIEW_ONBOARDING_SURVEYS',
    'MANAGE_MESSAGES',
    'SEND_BROADCASTS',
    'MANAGE_NOTIFICATIONS',
    'MANAGE_REVIEWS',
  ],
  MEMBER: [
    'ACCESS_MEMBER_DASHBOARD',
    'MANAGE_MEMBER_SETTINGS',
  ],
};

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ['ACCESS_ADMIN_DASHBOARD'],
  "/admin/users": ['MANAGE_USERS'],
  "/admin/users/[userId]": ['MANAGE_PERMISSIONS'],
  "/admin/blog": ['MANAGE_CONTENT'],
  "/admin/settings": ['MANAGE_ADMIN_SETTINGS'],
  "/admin/analytics": ['VIEW_ANALYTICS'],
  "/admin/fraud-detection": ['VIEW_FRAUD_DETECTION'],
  "/member": ['ACCESS_MEMBER_DASHBOARD'],
  "/member/messages": ['MANAGE_MESSAGES'],
};

// Helper function to create permission objects for a role
export const createRolePermissions = (role: Role, grantedBy?: string) => {
  const permissions = ROLE_PERMISSIONS[role];
  
  return permissions.map(permission => ({
    permission,
    grantedAt: new Date(),
    grantedBy: grantedBy || 'system',
    reason: `Default permissions for ${role} role`,
    expiresAt: null, // No expiration for default role permissions
  }));
};