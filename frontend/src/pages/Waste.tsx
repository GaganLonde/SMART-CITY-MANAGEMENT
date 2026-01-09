import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Truck, MapPin, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { wasteZonesApi, trucksApi, wasteLogsApi } from "@/lib/api";

export default function Waste() {
  const { data: zones = [], isLoading: loadingZones } = useQuery({
    queryKey: ["waste-zones"],
    queryFn: () => wasteZonesApi.getAll(),
    retry: false,
  });

  const { data: trucks = [], isLoading: loadingTrucks } = useQuery({
    queryKey: ["trucks"],
    queryFn: () => trucksApi.getAll(),
    retry: false,
  });

  const { data: logs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ["waste-logs"],
    queryFn: () => wasteLogsApi.getAll(),
    retry: false,
  });

  const zoneColumns = [
    { key: "zone_id", header: "Zone ID" },
    { key: "zone_name", header: "Name" },
    { key: "area_description", header: "Area Description" },
    { 
      key: "schedule", 
      header: "Schedule",
      render: (item: any) => {
        if (!item.schedule) return "N/A";
        try {
          const schedule = typeof item.schedule === 'string' ? JSON.parse(item.schedule) : item.schedule;
          return Object.entries(schedule).map(([day, time]) => `${day}: ${time}`).join(", ") || "N/A";
        } catch {
          return "N/A";
        }
      }
    },
  ];

  const truckColumns = [
    { key: "truck_id", header: "Truck ID" },
    { key: "registration_no", header: "Registration" },
    { key: "capacity_kg", header: "Capacity (kg)" },
    { key: "driver_id", header: "Driver ID" },
    { key: "active", header: "Status", render: (item: any) => <StatusBadge status={item.active ? "active" : "inactive"} /> },
  ];

  const logColumns = [
    { key: "log_id", header: "Log ID" },
    { key: "zone_id", header: "Zone ID" },
    { key: "truck_id", header: "Truck ID" },
    { 
      key: "collection_date", 
      header: "Date",
      render: (item: any) => item.collection_date ? new Date(item.collection_date).toLocaleDateString() : "N/A"
    },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.status?.toLowerCase() || "scheduled"} /> },
    { key: "notes", header: "Notes", render: (item: any) => <span className="line-clamp-1 max-w-xs">{item.notes || "N/A"}</span> },
  ];

  return (
    <MainLayout title="Waste Management" subtitle="Collection zones, trucks, and logs">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Collection Zones"
          value={zones.length.toString()}
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Active Trucks"
          value={trucks.filter((t: any) => t.active).length.toString()}
          icon={Truck}
          variant="success"
        />
        <StatCard
          title="Total Trucks"
          value={trucks.length.toString()}
          icon={Trash2}
          variant="accent"
        />
        <StatCard
          title="Collection Logs"
          value={logs.length.toString()}
          icon={Calendar}
          variant="warning"
        />
      </div>

      {/* Collection Schedule */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Collection Zones Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {zones.length > 0 ? (
              zones.map((zone: any) => {
                let scheduleText = "No schedule";
                if (zone.schedule) {
                  try {
                    const schedule = typeof zone.schedule === 'string' ? JSON.parse(zone.schedule) : zone.schedule;
                    scheduleText = Object.entries(schedule).map(([day, time]) => `${day}: ${time}`).join(", ");
                  } catch {
                    scheduleText = "Invalid schedule";
                  }
                }
                return (
                  <div 
                    key={zone.zone_id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{zone.zone_name}</p>
                      <p className="text-sm text-muted-foreground">{zone.area_description || "N/A"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{scheduleText}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No zones configured</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="zones" className="mt-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="zones" className="gap-2">
            <MapPin size={16} />
            Zones
          </TabsTrigger>
          <TabsTrigger value="trucks" className="gap-2">
            <Truck size={16} />
            Trucks
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Calendar size={16} />
            Collection Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Collection Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={zoneColumns} 
                data={zones}
                isLoading={loadingZones}
                emptyMessage="No zones found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trucks" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Truck Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={truckColumns} 
                data={trucks}
                isLoading={loadingTrucks}
                emptyMessage="No trucks found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Collection Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={logColumns} 
                data={logs}
                isLoading={loadingLogs}
                emptyMessage="No logs found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
