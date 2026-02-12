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
import { MessageSquare, Clock, CheckCircle, XCircle, Plus, PlayCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { complaintsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Complaints() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("Medium");
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading, refetch } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => complaintsApi.getAll(),
    retry: false,
  });

  const columns = [
    { key: "complaint_id", header: "ID" },
    { key: "category", header: "Category" },
    { key: "description", header: "Description", render: (item: any) => (
      <span className="line-clamp-1 max-w-xs">{item.description || "N/A"}</span>
    )},
    { key: "citizen_id", header: "Citizen ID" },
    { 
      key: "date_reported", 
      header: "Filed",
      render: (item: any) => item.date_reported ? new Date(item.date_reported).toLocaleDateString() : "N/A"
    },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.status?.toLowerCase() || "open"} /> },
    { key: "priority", header: "Priority" },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => {
        const currentStatus = item?.status || "Open";
        
        // Determine next status in cycle: Open → In Progress → Resolved → Open
        const getNextStatus = (status: string): string => {
          switch (status) {
            case "Open":
              return "In Progress";
            case "In Progress":
              return "Resolved";
            case "Resolved":
              return "Open";
            default:
              return "In Progress";
          }
        };
        
        const nextStatus = getNextStatus(currentStatus);
        
        // Get button text and icon based on next status
        const getButtonConfig = (nextStatus: string) => {
          switch (nextStatus) {
            case "In Progress":
              return { text: "Start Progress", icon: PlayCircle, variant: "default" as const };
            case "Resolved":
              return { text: "Mark Resolved", icon: CheckCircle, variant: "default" as const };
            case "Open":
              return { text: "Reopen", icon: XCircle, variant: "outline" as const };
            default:
              return { text: "Update Status", icon: PlayCircle, variant: "default" as const };
          }
        };
        
        const buttonConfig = getButtonConfig(nextStatus);
        const ButtonIcon = buttonConfig.icon;
        
        const isResolved = currentStatus === "Resolved";
        
        return (
          <div className="flex gap-2">
            <Button
              variant={buttonConfig.variant}
              size="sm"
              onClick={() => handleToggleStatus(item.complaint_id, nextStatus)}
              className="gap-2"
            >
              <ButtonIcon className="h-4 w-4" />
              {buttonConfig.text}
            </Button>
            {isResolved && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.complaint_id)}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get description from form
    const description = (formData.get("description") as string)?.trim() || null;
    
    if (!description) {
      toast({ 
        title: "Error", 
        description: "Please provide a description", 
        variant: "destructive" 
      });
      return;
    }

    if (!selectedCategory) {
      toast({ 
        title: "Error", 
        description: "Please select a category", 
        variant: "destructive" 
      });
      return;
    }

    // Build data object, only including fields that have values
    const data: any = {
      category: selectedCategory,
      description: description,
      priority: selectedPriority,
      status: "Open",
    };
    
    // Add citizen_id only if provided
    const citizenId = formData.get("citizen_id") && (formData.get("citizen_id") as string).trim();
    if (citizenId) {
      data.citizen_id = parseInt(citizenId);
    }
    
    // Don't send date_reported or assigned_to - let database handle defaults

    try {
      await complaintsApi.create(data);
      toast({ title: "Success", description: "Complaint filed successfully" });
      // Reset form and state
      if (formRef.current) {
        formRef.current.reset();
      }
      setSelectedCategory("");
      setSelectedPriority("Medium");
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to file complaint";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  };

  const pending = complaints.filter((c: any) => c.status === "Open").length;
  const active = complaints.filter((c: any) => c.status === "In Progress").length;
  const resolved = complaints.filter((c: any) => c.status === "Resolved").length;

  const handleToggleStatus = async (complaintId: number, newStatus: string) => {
    try {
      await complaintsApi.update(complaintId, { status: newStatus });
      toast({
        title: "Success",
        description: `Complaint status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    } catch (error: any) {
      // Extract error message properly
      let errorMessage = "Failed to update complaint status";
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

  const handleDelete = async (complaintId: number) => {
    if (!confirm("Are you sure you want to delete this resolved complaint? This action cannot be undone.")) {
      return;
    }

    try {
      await complaintsApi.delete(complaintId);
      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      let errorMessage = "Failed to delete complaint";
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
    <MainLayout title="Complaints" subtitle="Citizen complaints and feedback">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Complaints"
          value={complaints.length || "0"}
          icon={MessageSquare}
          variant="primary"
        />
        <StatCard
          title="Pending"
          value={pending || "0"}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="In Progress"
          value={active || "0"}
          icon={MessageSquare}
          variant="info"
        />
        <StatCard
          title="Resolved"
          value={resolved || "0"}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Complaint Categories */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Categories Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { category: "Infrastructure", color: "bg-primary/10 text-primary" },
              { category: "Utilities", color: "bg-warning/10 text-warning" },
              { category: "Sanitation", color: "bg-accent/10 text-accent" },
              { category: "Other", color: "bg-muted text-muted-foreground" },
            ].map((cat) => {
              const count = complaints.filter((c: any) => c.category === cat.category).length;
              return (
                <div 
                  key={cat.category}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <span className="font-medium text-foreground">{cat.category}</span>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cat.color}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Complaints</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedCategory("");
              setSelectedPriority("Medium");
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                File Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>File New Complaint</DialogTitle>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Sanitation">Sanitation</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_id">Citizen ID <span className="text-muted-foreground text-sm">(optional)</span></Label>
                  <Input id="citizen_id" name="citizen_id" type="number" placeholder="Leave empty if not applicable" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Complaint</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={complaints}
            isLoading={isLoading}
            emptyMessage="No complaints filed yet"
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
