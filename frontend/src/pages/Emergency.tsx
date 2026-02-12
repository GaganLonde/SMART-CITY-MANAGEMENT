import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Ambulance, Shield, Flame, Plus, Phone, CheckCircle, Send, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { emergencyRequestsApi, emergencyServicesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Emergency() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading: loadingRequests, refetch } = useQuery({
    queryKey: ["emergency-requests"],
    queryFn: () => emergencyRequestsApi.getAll(),
    retry: false,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["emergency-services"],
    queryFn: () => emergencyServicesApi.getAll(),
    retry: false,
  });

  const requestColumns = [
    { key: "req_id", header: "ID" },
    { 
      key: "service_id", 
      header: "Service Type",
      render: (item: any) => {
        const service = services.find((s: any) => s.service_id === item.service_id);
        return service?.service_type || "Unknown";
      }
    },
    { key: "location", header: "Location" },
    { key: "notes", header: "Notes", render: (item: any) => (
      <span className="line-clamp-1 max-w-xs">{item.notes || "N/A"}</span>
    )},
    { 
      key: "request_datetime", 
      header: "Request Time",
      render: (item: any) => item.request_datetime ? new Date(item.request_datetime).toLocaleString() : "N/A"
    },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.status?.toLowerCase() || "open"} /> },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => {
        const currentStatus = item?.status || "Open";
        const isResolved = currentStatus === "Resolved";
        const isDispatched = currentStatus === "Dispatched";
        
        return (
          <div className="flex gap-2">
            {!isDispatched && currentStatus === "Open" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleToggleStatus(item.req_id, "Dispatched")}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Dispatch
              </Button>
            )}
            {!isResolved && (
              <Button
                variant={isResolved ? "outline" : "default"}
                size="sm"
                onClick={() => handleToggleStatus(item.req_id, "Resolved")}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Resolve
              </Button>
            )}
            {isResolved && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.req_id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const serviceColumns = [
    { key: "service_id", header: "ID" },
    { key: "service_type", header: "Type" },
    { key: "phone", header: "Contact" },
    { key: "area_covered", header: "Area Covered" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get service_id from controlled state
    if (!selectedServiceId) {
      toast({ 
        title: "Error", 
        description: "Please select an emergency service", 
        variant: "destructive" 
      });
      return;
    }

    // Build data object, only including fields that have values
    const data: any = {
      service_id: parseInt(selectedServiceId),
      status: "Open",
    };
    
    // Add optional fields only if they have values
    const location = (formData.get("location") as string)?.trim();
    if (location) data.location = location;
    
    const notes = (formData.get("notes") as string)?.trim();
    if (notes) data.notes = notes;
    
    const citizenId = formData.get("citizen_id") && (formData.get("citizen_id") as string).trim();
    if (citizenId) {
      data.citizen_id = parseInt(citizenId);
    }
    
    // Don't send request_datetime - let database use DEFAULT CURRENT_TIMESTAMP

    try {
      await emergencyRequestsApi.create(data);
      toast({ title: "Success", description: "Emergency request submitted" });
      // Reset form and state
      if (formRef.current) {
        formRef.current.reset();
      }
      setSelectedServiceId("");
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to submit request";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  };

  const activeRequests = requests.filter((r: any) => r.status === "Open" || r.status === "Dispatched");

  const handleToggleStatus = async (reqId: number, newStatus: string) => {
    try {
      await emergencyRequestsApi.update(reqId, { status: newStatus });
      toast({
        title: "Success",
        description: `Emergency request status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ["emergency-requests"] });
    } catch (error: any) {
      // Extract error message properly
      let errorMessage = "Failed to update request status";
      if (error?.message) {
        errorMessage = typeof error.message === 'string' ? error.message : String(error.message);
      } else if (error?.detail) {
        errorMessage = typeof error.detail === 'string' ? error.detail : String(error.detail);
      } else if (error) {
        errorMessage = typeof error === 'string' ? error : String(error);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reqId: number) => {
    if (!confirm("Are you sure you want to delete this resolved emergency request? This action cannot be undone.")) {
      return;
    }

    try {
      await emergencyRequestsApi.delete(reqId);
      toast({
        title: "Success",
        description: "Emergency request deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["emergency-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      let errorMessage = "Failed to delete emergency request";
      if (error?.message) {
        errorMessage = typeof error.message === 'string' ? error.message : String(error.message);
      } else if (error?.detail) {
        errorMessage = typeof error.detail === 'string' ? error.detail : String(error.detail);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Emergency Services" subtitle="Manage emergency requests and services">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Emergencies"
          value={activeRequests.length.toString()}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Medical Services"
          value={services.filter((s: any) => s.service_type?.toLowerCase().includes("ambulance") || s.service_type?.toLowerCase().includes("medical")).length.toString()}
          icon={Ambulance}
          variant="success"
        />
        <StatCard
          title="Fire Services"
          value={services.filter((s: any) => s.service_type?.toLowerCase().includes("fire")).length.toString()}
          icon={Flame}
          variant="warning"
        />
        <StatCard
          title="Police Services"
          value={services.filter((s: any) => s.service_type?.toLowerCase().includes("police")).length.toString()}
          icon={Shield}
          variant="primary"
        />
      </div>

      {/* Emergency Hotlines */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-destructive" />
            Emergency Hotlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { type: "Medical", number: "108", icon: Ambulance, color: "from-success to-accent" },
              { type: "Fire", number: "101", icon: Flame, color: "from-warning to-destructive" },
              { type: "Police", number: "100", icon: Shield, color: "from-primary to-info" },
              { type: "Unified Emergency", number: "112", icon: AlertTriangle, color: "from-destructive to-warning" },
            ].map((hotline) => (
              <div 
                key={hotline.type}
                className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${hotline.color}`}>
                  <hotline.icon size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{hotline.type}</p>
                  <p className="text-2xl font-bold text-primary">{hotline.number}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requests */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Emergency Requests</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedServiceId("");
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="destructive">
                <Plus size={16} />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Emergency Request</DialogTitle>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service_id">Emergency Service</Label>
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service: any) => (
                        <SelectItem key={service.service_id} value={service.service_id.toString()}>
                          {service.service_type} {service.phone ? `(${service.phone})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_id">Citizen ID <span className="text-muted-foreground text-sm">(optional)</span></Label>
                  <Input id="citizen_id" name="citizen_id" type="number" placeholder="Leave empty if not applicable" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={requestColumns} 
            data={requests}
            isLoading={loadingRequests}
            emptyMessage="No emergency requests found"
          />
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Emergency Services</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={serviceColumns} 
            data={services}
            isLoading={loadingServices}
            emptyMessage="No emergency services registered"
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
