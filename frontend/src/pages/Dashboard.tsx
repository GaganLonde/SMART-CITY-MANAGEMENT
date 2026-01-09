import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Users,
  Zap,
  Droplets,
  Bus,
  AlertTriangle,
  Trash2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { statsApi, emergencyServicesApi } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => statsApi.getStats(),
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: services = [] } = useQuery({
    queryKey: ["emergency-services"],
    queryFn: () => emergencyServicesApi.getAll(),
    retry: false,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toFixed(0)}`;
  };

  const getServiceType = (serviceId: number) => {
    const service = services.find((s: any) => s.service_id === serviceId);
    return service?.service_type || "Unknown";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Dashboard"
        subtitle="Welcome to Smart City Management System"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </MainLayout>
    );
  }

  const statsData = stats || {
    total_citizens: 0,
    electricity_usage_kwh: 0,
    water_usage_litres: 0,
    active_buses: 0,
    emergency_open: 0,
    complaints_open: 0,
    total_revenue: 0,
    pending_bills: 0,
    recent_emergencies: [],
    recent_complaints: [],
  };

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Welcome to Smart City Management System"
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Citizens"
          value={statsData.total_citizens?.toLocaleString() || "0"}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Electricity Usage"
          value={`${formatNumber(statsData.electricity_usage_kwh || 0)} kWh`}
          icon={Zap}
          variant="warning"
          subtitle="This month"
        />
        <StatCard
          title="Water Usage"
          value={`${formatNumber(statsData.water_usage_litres || 0)} L`}
          icon={Droplets}
          variant="accent"
          subtitle="This month"
        />
        <StatCard
          title="Active Buses"
          value={statsData.active_buses?.toString() || "0"}
          icon={Bus}
          variant="success"
        />
      </div>

      {/* Second Row */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Emergency Requests"
          value={
            (statsData.emergency_open || 0) +
            (statsData.emergency_dispatched || 0)
          }
          icon={AlertTriangle}
          variant="destructive"
          subtitle="Active"
        />
        <StatCard
          title="Waste Zones"
          value={statsData.waste_zones?.toString() || "0"}
          icon={Trash2}
          variant="success"
        />
        <StatCard
          title="Open Complaints"
          value={statsData.complaints_open?.toString() || "0"}
          icon={MessageSquare}
          variant="warning"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(statsData.total_revenue || 0)}
          icon={TrendingUp}
          variant="primary"
        />
      </div>

      {/* Content Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Emergency Requests */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Emergency Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.recent_emergencies &&
              statsData.recent_emergencies.length > 0 ? (
                statsData.recent_emergencies.map((request: any) => (
                  <div
                    key={request.req_id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {getServiceType(request.service_id)} Emergency
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.location || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={request.status?.toLowerCase() || "open"}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.request_datetime
                          ? getTimeAgo(request.request_datetime)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent emergency requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.recent_complaints &&
              statsData.recent_complaints.length > 0 ? (
                statsData.recent_complaints.map((complaint: any) => (
                  <div
                    key={complaint.complaint_id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground line-clamp-1">
                        {complaint.description || "No description"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.category || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={complaint.status?.toLowerCase() || "open"}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {complaint.date_reported
                          ? getTimeAgo(complaint.date_reported)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent complaints
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                label: "Add Citizen",
                color: "from-primary to-accent",
              },
              {
                icon: AlertTriangle,
                label: "New Emergency",
                color: "from-destructive to-warning",
              },
              {
                icon: MessageSquare,
                label: "File Complaint",
                color: "from-info to-primary",
              },
              {
                icon: Zap,
                label: "Generate Bill",
                color: "from-warning to-accent",
              },
            ].map((action, index) => (
              <button
                key={index}
                className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-muted/50"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.color}`}
                >
                  <action.icon size={20} className="text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
