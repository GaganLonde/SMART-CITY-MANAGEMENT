import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "destructive" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-muted text-muted-foreground",
    trend: "text-muted-foreground",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    trend: "text-primary",
  },
  accent: {
    icon: "bg-accent/10 text-accent",
    trend: "text-accent",
  },
  success: {
    icon: "bg-success/10 text-success",
    trend: "text-success",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    trend: "text-warning",
  },
  destructive: {
    icon: "bg-destructive/10 text-destructive",
    trend: "text-destructive",
  },
  info: {
    icon: "bg-info/10 text-info",
    trend: "text-info",
  },
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", styles.trend)}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", styles.icon)}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
