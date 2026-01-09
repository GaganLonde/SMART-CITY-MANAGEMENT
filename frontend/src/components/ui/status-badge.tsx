import { cn } from "@/lib/utils";

type StatusType = "pending" | "active" | "completed" | "cancelled" | "warning" | "error" | "success" | "info";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  active: "bg-success/10 text-success border-success/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const styles = statusStyles[normalizedStatus] || statusStyles.info;

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
}
