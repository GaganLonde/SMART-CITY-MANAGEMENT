import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { MessageSquare, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { complaintsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Complaints() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      category: formData.get("category") as string || null,
      description: formData.get("description") as string || null,
      citizen_id: formData.get("citizen_id") ? parseInt(formData.get("citizen_id") as string) : null,
      priority: formData.get("priority") as string || "Medium",
      status: "Open",
    };

    try {
      await complaintsApi.create(data);
      toast({ title: "Success", description: "Complaint filed successfully" });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({ title: "Error", description: "Failed to file complaint", variant: "destructive" });
    }
  };

  const pending = complaints.filter((c: any) => c.status === "Open").length;
  const active = complaints.filter((c: any) => c.status === "In Progress").length;
  const resolved = complaints.filter((c: any) => c.status === "Resolved").length;

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
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
                  <Label htmlFor="citizen_id">Citizen ID (optional)</Label>
                  <Input id="citizen_id" name="citizen_id" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="Medium">
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
