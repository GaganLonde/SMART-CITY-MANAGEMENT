import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Droplets, 
  Bus, 
  AlertTriangle, 
  Trash2, 
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Citizens", path: "/citizens" },
  { icon: Zap, label: "Utilities", path: "/utilities" },
  { icon: Bus, label: "Transport", path: "/transport" },
  { icon: AlertTriangle, label: "Emergency", path: "/emergency" },
  { icon: Trash2, label: "Waste Management", path: "/waste" },
  { icon: MessageSquare, label: "Complaints", path: "/complaints" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-primary to-accent" />
            </div>
            <span className="font-semibold text-foreground">SmartCity</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <item.icon 
                size={20} 
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">
              Smart City v1.0
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
