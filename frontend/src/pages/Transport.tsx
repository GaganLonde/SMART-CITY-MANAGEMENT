import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, Route, User, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { routesApi, busesApi, driversApi } from "@/lib/api";

export default function Transport() {
  const { data: routes = [], isLoading: loadingRoutes, error: errorRoutes } = useQuery({
    queryKey: ["routes"],
    queryFn: () => routesApi.getAll().catch(() => []),
    retry: false,
  });

  const { data: buses = [], isLoading: loadingBuses, error: errorBuses } = useQuery({
    queryKey: ["buses"],
    queryFn: () => busesApi.getAll().catch(() => []),
    retry: false,
  });

  const { data: drivers = [], isLoading: loadingDrivers, error: errorDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => driversApi.getAll().catch(() => []),
    retry: false,
  });

  const routeColumns = [
    { key: "route_id", header: "Route ID" },
    { key: "route_name", header: "Name" },
    { key: "start_point", header: "Start" },
    { key: "end_point", header: "End" },
    { 
      key: "distance_km", 
      header: "Distance (km)", 
      render: (item: any) => {
        try {
          const dist = item?.distance_km;
          if (dist == null) return "N/A";
          const num = typeof dist === 'number' ? dist : parseFloat(dist);
          return isNaN(num) ? "N/A" : num.toFixed(2);
        } catch {
          return "N/A";
        }
      }
    },
  ];

  const busColumns = [
    { key: "bus_id", header: "Bus ID" },
    { key: "registration_no", header: "Registration" },
    { key: "route_id", header: "Route ID" },
    { key: "capacity", header: "Capacity" },
    { key: "driver_id", header: "Driver ID" },
    { 
      key: "active", 
      header: "Status", 
      render: (item: any) => {
        try {
          const isActive = item?.active === true || item?.active === 1;
          return <StatusBadge status={isActive ? "active" : "inactive"} />;
        } catch {
          return <StatusBadge status="inactive" />;
        }
      }
    },
  ];

  const driverColumns = [
    { key: "driver_id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "license_no", header: "License" },
    { key: "phone", header: "Phone" },
    { key: "address", header: "Address" },
  ];

  const routesArray = Array.isArray(routes) ? routes : [];
  const busesArray = Array.isArray(buses) ? buses : [];
  const driversArray = Array.isArray(drivers) ? drivers : [];

  const totalDistance = routesArray.reduce((sum: number, r: any) => {
    const dist = parseFloat(r?.distance_km) || 0;
    return sum + dist;
  }, 0);

  const activeBusesCount = busesArray.filter((b: any) => b?.active === true || b?.active === 1).length;

  return (
    <MainLayout title="Transport" subtitle="Public transport management">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Routes"
          value={routesArray.length.toString()}
          icon={Route}
          variant="primary"
        />
        <StatCard
          title="Active Buses"
          value={activeBusesCount.toString()}
          icon={Bus}
          variant="success"
        />
        <StatCard
          title="Total Drivers"
          value={driversArray.length.toString()}
          icon={User}
          variant="accent"
        />
        <StatCard
          title="Total Distance"
          value={`${totalDistance.toFixed(1)} km`}
          icon={MapPin}
          variant="warning"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="routes" className="mt-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="routes" className="gap-2">
            <Route size={16} />
            Routes
          </TabsTrigger>
          <TabsTrigger value="buses" className="gap-2">
            <Bus size={16} />
            Buses
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-2">
            <User size={16} />
            Drivers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Transport Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={routeColumns} 
                data={routesArray}
                isLoading={loadingRoutes}
                emptyMessage="No routes found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buses" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Bus Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={busColumns} 
                data={busesArray}
                isLoading={loadingBuses}
                emptyMessage="No buses found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={driverColumns} 
                data={driversArray}
                isLoading={loadingDrivers}
                emptyMessage="No drivers found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
