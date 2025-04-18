
// Role-based authentication types
export enum UserRole {
  PLATFORM_ADMIN = "platform_admin",
  SUPPORT_STAFF = "support_staff",
  WAREHOUSE_ADMIN = "warehouse_admin",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
