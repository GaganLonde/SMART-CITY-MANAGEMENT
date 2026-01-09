import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Users, Trash2 } from "lucide-react";
import { citizensApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Citizens() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const {
    data: citizens = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["citizens", searchTerm],
    queryFn: () => citizensApi.getAll(0, 100, searchTerm || undefined),
    retry: false,
  });

  const columns = [
    { key: "citizen_id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "gender", header: "Gender" },
    { key: "address_id", header: "Address ID" },
    {
      key: "created_at",
      header: "Registered",
      render: (item: any) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "N/A",
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.citizen_id);
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Map gender values from frontend to database format
    const genderMap: Record<string, string> = {
      Male: "M",
      Female: "F",
      Other: "Other",
    };

    const genderValue = formData.get("gender") as string;
    const mappedGender = genderMap[genderValue] || "Other";

    // Helper function to convert empty strings to null
    const getValueOrNull = (
      value: FormDataEntryValue | null
    ): string | null => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return null;
      }
      return value as string;
    };

    const data = {
      name: formData.get("name") as string,
      email: getValueOrNull(formData.get("email")),
      phone: getValueOrNull(formData.get("phone")),
      dob: getValueOrNull(formData.get("dob")),
      gender: mappedGender,
      address_id: formData.get("address_id")
        ? parseInt(formData.get("address_id") as string)
        : null,
    };

    try {
      await citizensApi.create(data);
      toast({ title: "Success", description: "Citizen created successfully" });
      // Reset form before closing dialog
      if (formRef.current) {
        formRef.current.reset();
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create citizen";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (citizenId: number) => {
    if (!confirm("Are you sure you want to delete this citizen?")) {
      return;
    }

    try {
      await citizensApi.delete(citizenId);
      toast({ title: "Success", description: "Citizen deleted successfully" });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete citizen",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Citizens" subtitle="Manage city residents">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Citizens Directory
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search citizens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-secondary/50 pl-9"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Citizen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Citizen</DialogTitle>
                </DialogHeader>
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="dob" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_id">Address ID</Label>
                    <Input id="address_id" name="address_id" type="number" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Citizen</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={citizens}
            isLoading={isLoading}
            emptyMessage="No citizens found. Add your first citizen or connect to your API."
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
