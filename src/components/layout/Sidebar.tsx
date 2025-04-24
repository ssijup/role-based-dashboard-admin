import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FolderTree, // Added import for FolderTree icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const NavItem = ({ to, icon: Icon, label, isCollapsed, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout, checkPermission } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: [UserRole.PLATFORM_ADMIN, UserRole.SUPPORT_STAFF, UserRole.WAREHOUSE_ADMIN],
    },
    {
      to: "/users",
      icon: Users,
      label: "Users",
      roles: [UserRole.PLATFORM_ADMIN],
    },
    {
      to: "/warehouses",
      icon: Warehouse,
      label: "Warehouses",
      roles: [UserRole.PLATFORM_ADMIN, UserRole.SUPPORT_STAFF, UserRole.WAREHOUSE_ADMIN],
    },
    {
      to: "/announcements",
      icon: Bell,
      label: "Announcements",
      roles: [UserRole.PLATFORM_ADMIN, UserRole.SUPPORT_STAFF, UserRole.WAREHOUSE_ADMIN],
    },
    { // Added Categories navigation item
      to: "/categories",
      icon: FolderTree,
      label: "Categories",
      roles: [UserRole.PLATFORM_ADMIN], // Adjust roles as needed
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="font-semibold text-sidebar-foreground text-lg">Admin Panel</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) =>
          checkPermission(item.roles) ? (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
              isActive={pathname.startsWith(item.to)}
            />
          ) : null
        )}
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}