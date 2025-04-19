import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Warehouse } from "@/lib/types";
import { warehouseApi } from "@/services/warehouse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, PlusCircle, Edit, Trash, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function WarehousesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddWarehouseDialogOpen, setIsAddWarehouseDialogOpen] = useState(false);
  const [isEditWarehouseDialogOpen, setIsEditWarehouseDialogOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<Warehouse | null>(null);
  const [newWarehouse, setNewWarehouse] = useState({
    city: "",
    latitude: "",
    longitude: "",
  });

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: warehouseApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: warehouseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setIsAddWarehouseDialogOpen(false);
      setNewWarehouse({ city: "", latitude: "", longitude: "" });
      toast({
        title: "Success",
        description: "Warehouse added successfully",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) => 
      warehouseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setIsEditWarehouseDialogOpen(false);
      setCurrentWarehouse(null);
      toast({
        title: "Success",
        description: "Warehouse updated successfully",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: warehouseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({
        title: "Success",
        description: "Warehouse deleted successfully",
      });
    }
  });

  const handleAddWarehouse = () => {
    createMutation.mutate({
      city: newWarehouse.city,
      latitude: parseFloat(newWarehouse.latitude),
      longitude: parseFloat(newWarehouse.longitude),
    });
  };

  const handleEditWarehouse = () => {
    if (!currentWarehouse?.id) return;
    
    updateMutation.mutate({
      id: currentWarehouse.id,
      data: currentWarehouse
    });
  };

  const handleDeleteWarehouse = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations and details
          </p>
        </div>
        <Dialog open={isAddWarehouseDialogOpen} onOpenChange={setIsAddWarehouseDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Warehouse</DialogTitle>
              <DialogDescription>
                Create a new warehouse location.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newWarehouse.city}
                  onChange={(e) =>
                    setNewWarehouse({ ...newWarehouse, city: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={newWarehouse.latitude}
                  onChange={(e) =>
                    setNewWarehouse({ ...newWarehouse, latitude: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={newWarehouse.longitude}
                  onChange={(e) =>
                    setNewWarehouse({ ...newWarehouse, longitude: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddWarehouseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWarehouse}>Add Warehouse</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Warehouses</CardTitle>
          <CardDescription>
            A list of all warehouse locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.city}</TableCell>
                  <TableCell>{warehouse.latitude.toFixed(6)}</TableCell>
                  <TableCell>{warehouse.longitude.toFixed(6)}</TableCell>
                  <TableCell>{new Date(warehouse.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(warehouse.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            window.open(`https://maps.google.com/?q=${warehouse.latitude},${warehouse.longitude}`, '_blank');
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          View on Map
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentWarehouse(warehouse);
                            setIsEditWarehouseDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteWarehouse(warehouse.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Warehouse Dialog */}
      {currentWarehouse && (
        <Dialog open={isEditWarehouseDialogOpen} onOpenChange={setIsEditWarehouseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Warehouse</DialogTitle>
              <DialogDescription>
                Update warehouse location details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={currentWarehouse.city}
                  onChange={(e) =>
                    setCurrentWarehouse({ ...currentWarehouse, city: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="0.000001"
                  value={currentWarehouse.latitude}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="0.000001"
                  value={currentWarehouse.longitude}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditWarehouseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditWarehouse}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
