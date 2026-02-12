import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Zap, Droplets, DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { electricityBillsApi, waterBillsApi, electricityUsageApi, waterUsageApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Utilities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: electricityBills = [], isLoading: loadingElecBills, error: errorElecBills } = useQuery({
    queryKey: ["electricity-bills"],
    queryFn: () => electricityBillsApi.getAll().catch(() => []),
    retry: false,
  });

  const { data: waterBills = [], isLoading: loadingWaterBills, error: errorWaterBills } = useQuery({
    queryKey: ["water-bills"],
    queryFn: () => waterBillsApi.getAll().catch(() => []),
    retry: false,
  });

  const { data: electricityUsage = [], isLoading: loadingElecUsage, error: errorElecUsage } = useQuery({
    queryKey: ["electricity-usage"],
    queryFn: () => electricityUsageApi.getAll().catch(() => []),
    retry: false,
  });

  const { data: waterUsage = [], isLoading: loadingWaterUsage, error: errorWaterUsage } = useQuery({
    queryKey: ["water-usage"],
    queryFn: () => waterUsageApi.getAll().catch(() => []),
    retry: false,
  });

  const electricityBillColumns = [
    { key: "bill_id", header: "Bill ID" },
    { key: "account_id", header: "Account" },
    { key: "bill_year", header: "Year" },
    { key: "bill_month", header: "Month" },
    { 
      key: "units_consumed", 
      header: "Units (kWh)", 
      render: (item: any) => {
        try {
          const val = item?.units_consumed;
          if (val == null) return '0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '0.00' : num.toFixed(2);
        } catch {
          return '0.00';
        }
      }
    },
    { 
      key: "amount", 
      header: "Amount", 
      render: (item: any) => {
        try {
          const val = item?.amount;
          if (val == null) return '₹0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '₹0.00' : `₹${num.toFixed(2)}`;
        } catch {
          return '₹0.00';
        }
      }
    },
    { 
      key: "due_date", 
      header: "Due Date", 
      render: (item: any) => {
        try {
          if (!item?.due_date) return "N/A";
          return new Date(item.due_date).toLocaleDateString();
        } catch {
          return "N/A";
        }
      }
    },
    { 
      key: "status", 
      header: "Status", 
      render: (item: any) => {
        try {
          const status = item?.status?.toLowerCase() || "unpaid";
          return <StatusBadge status={status} />;
        } catch {
          return <StatusBadge status="unpaid" />;
        }
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => {
        const isPaid = item?.status === "Paid";
        return (
          <Button
            variant={isPaid ? "outline" : "default"}
            size="sm"
            onClick={() => handleToggleBillStatus("electricity", item.bill_id, isPaid ? "Unpaid" : "Paid")}
            className="gap-2"
          >
            {isPaid ? (
              <>
                <XCircle className="h-4 w-4" />
                Mark Unpaid
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Mark Paid
              </>
            )}
          </Button>
        );
      },
    },
  ];

  const waterBillColumns = [
    { key: "bill_id", header: "Bill ID" },
    { key: "account_id", header: "Account" },
    { key: "bill_year", header: "Year" },
    { key: "bill_month", header: "Month" },
    { 
      key: "litres_consumed", 
      header: "Litres", 
      render: (item: any) => {
        try {
          const val = item?.litres_consumed;
          if (val == null) return '0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '0.00' : num.toFixed(2);
        } catch {
          return '0.00';
        }
      }
    },
    { 
      key: "amount", 
      header: "Amount", 
      render: (item: any) => {
        try {
          const val = item?.amount;
          if (val == null) return '₹0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '₹0.00' : `₹${num.toFixed(2)}`;
        } catch {
          return '₹0.00';
        }
      }
    },
    { 
      key: "due_date", 
      header: "Due Date", 
      render: (item: any) => {
        try {
          if (!item?.due_date) return "N/A";
          return new Date(item.due_date).toLocaleDateString();
        } catch {
          return "N/A";
        }
      }
    },
    { 
      key: "status", 
      header: "Status", 
      render: (item: any) => {
        try {
          const status = item?.status?.toLowerCase() || "unpaid";
          return <StatusBadge status={status} />;
        } catch {
          return <StatusBadge status="unpaid" />;
        }
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => {
        const isPaid = item?.status === "Paid";
        return (
          <Button
            variant={isPaid ? "outline" : "default"}
            size="sm"
            onClick={() => handleToggleBillStatus("water", item.bill_id, isPaid ? "Unpaid" : "Paid")}
            className="gap-2"
          >
            {isPaid ? (
              <>
                <XCircle className="h-4 w-4" />
                Mark Unpaid
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Mark Paid
              </>
            )}
          </Button>
        );
      },
    },
  ];

  const electricityUsageColumns = [
    { key: "usage_id", header: "ID" },
    { key: "account_id", header: "Account" },
    { key: "usage_month", header: "Year" },
    { key: "usage_month_number", header: "Month" },
    { 
      key: "units_consumed", 
      header: "Units (kWh)", 
      render: (item: any) => {
        try {
          const val = item?.units_consumed;
          if (val == null) return '0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '0.00' : num.toFixed(2);
        } catch {
          return '0.00';
        }
      }
    },
    { 
      key: "meter_reading_time", 
      header: "Reading Time", 
      render: (item: any) => {
        try {
          if (!item?.meter_reading_time) return "N/A";
          return new Date(item.meter_reading_time).toLocaleString();
        } catch {
          return "N/A";
        }
      }
    },
  ];

  const waterUsageColumns = [
    { key: "usage_id", header: "ID" },
    { key: "account_id", header: "Account" },
    { key: "usage_month", header: "Year" },
    { key: "usage_month_number", header: "Month" },
    { 
      key: "litres_consumed", 
      header: "Litres", 
      render: (item: any) => {
        try {
          const val = item?.litres_consumed;
          if (val == null) return '0.00';
          const num = typeof val === 'number' ? val : parseFloat(val);
          return isNaN(num) ? '0.00' : num.toFixed(2);
        } catch {
          return '0.00';
        }
      }
    },
    { 
      key: "recorded_at", 
      header: "Recorded At", 
      render: (item: any) => {
        try {
          if (!item?.recorded_at) return "N/A";
          return new Date(item.recorded_at).toLocaleString();
        } catch {
          return "N/A";
        }
      }
    },
  ];

  const electricityBillsArray = Array.isArray(electricityBills) ? electricityBills : [];
  const waterBillsArray = Array.isArray(waterBills) ? waterBills : [];
  const electricityUsageArray = Array.isArray(electricityUsage) ? electricityUsage : [];
  const waterUsageArray = Array.isArray(waterUsage) ? waterUsage : [];

  // Calculate revenue from bills marked as "Paid"
  const electricityRevenue = electricityBillsArray
    .filter((b: any) => b?.status === "Paid")
    .reduce((sum: number, b: any) => {
      const amount = parseFloat(b?.amount) || 0;
      return sum + amount;
    }, 0);

  const waterRevenue = waterBillsArray
    .filter((b: any) => b?.status === "Paid")
    .reduce((sum: number, b: any) => {
      const amount = parseFloat(b?.amount) || 0;
      return sum + amount;
    }, 0);

  const totalRevenue = electricityRevenue + waterRevenue;

  const totalElectricityUsage = electricityUsageArray.reduce(
    (sum: number, u: any) => sum + (parseFloat(u?.units_consumed) || 0),
    0
  );

  const totalWaterUsage = waterUsageArray.reduce(
    (sum: number, u: any) => sum + (parseFloat(u?.litres_consumed) || 0),
    0
  );

  const pendingBills = 
    electricityBillsArray.filter((b: any) => b?.status !== "Paid").length +
    waterBillsArray.filter((b: any) => b?.status !== "Paid").length;

  const handleToggleBillStatus = async (type: "electricity" | "water", billId: number, newStatus: string) => {
    try {
      if (type === "electricity") {
        await electricityBillsApi.update(billId, { status: newStatus });
      } else {
        await waterBillsApi.update(billId, { status: newStatus });
      }
      toast({
        title: "Success",
        description: `Bill status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ["electricity-bills"] });
      queryClient.invalidateQueries({ queryKey: ["water-bills"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update bill status",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Utilities" subtitle="Manage electricity and water services">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Electricity Revenue"
          value={
            electricityRevenue >= 100000
              ? `₹${(electricityRevenue / 100000).toFixed(1)} L`
              : electricityRevenue >= 1000
              ? `₹${(electricityRevenue / 1000).toFixed(1)}K`
              : `₹${electricityRevenue.toFixed(0)}`
          }
          icon={Zap}
          variant="warning"
          subtitle="From paid bills"
        />
        <StatCard
          title="Water Revenue"
          value={
            waterRevenue >= 100000
              ? `₹${(waterRevenue / 100000).toFixed(1)} L`
              : waterRevenue >= 1000
              ? `₹${(waterRevenue / 1000).toFixed(1)}K`
              : `₹${waterRevenue.toFixed(0)}`
          }
          icon={Droplets}
          variant="accent"
          subtitle="From paid bills"
        />
        <StatCard
          title="Total Revenue"
          value={
            totalRevenue >= 100000
              ? `₹${(totalRevenue / 100000).toFixed(1)} L`
              : totalRevenue >= 1000
              ? `₹${(totalRevenue / 1000).toFixed(1)}K`
              : `₹${totalRevenue.toFixed(0)}`
          }
          icon={DollarSign}
          variant="primary"
          subtitle="From paid bills"
        />
        <StatCard
          title="Pending Bills"
          value={pendingBills.toString()}
          icon={TrendingUp}
          variant="destructive"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="electricity" className="mt-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="electricity" className="gap-2">
            <Zap size={16} />
            Electricity
          </TabsTrigger>
          <TabsTrigger value="water" className="gap-2">
            <Droplets size={16} />
            Water
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Electricity Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={electricityBillColumns} 
                  data={electricityBillsArray}
                  isLoading={loadingElecBills}
                  emptyMessage="No electricity bills found"
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Electricity Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={electricityUsageColumns} 
                  data={electricityUsageArray}
                  isLoading={loadingElecUsage}
                  emptyMessage="No usage records found"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="water" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Water Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={waterBillColumns} 
                  data={waterBillsArray}
                  isLoading={loadingWaterBills}
                  emptyMessage="No water bills found"
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Water Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={waterUsageColumns} 
                  data={waterUsageArray}
                  isLoading={loadingWaterUsage}
                  emptyMessage="No usage records found"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
