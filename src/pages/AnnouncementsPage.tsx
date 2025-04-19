import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Announcement } from "@/lib/types";
import { announcementApi } from "@/services/announcement";
import { useAuth } from "@/contexts/AuthContext";
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
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, PlusCircle, Edit, Trash, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddAnnouncementDialogOpen, setIsAddAnnouncementDialogOpen] = useState(false);
  const [isEditAnnouncementDialogOpen, setIsEditAnnouncementDialogOpen] = useState(false);
  const [isViewAnnouncementDialogOpen, setIsViewAnnouncementDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: announcementApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsAddAnnouncementDialogOpen(false);
      setNewAnnouncement({ title: "", content: "" });
      toast({
        title: "Success",
        description: "Announcement published successfully",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      announcementApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsEditAnnouncementDialogOpen(false);
      setCurrentAnnouncement(null);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: announcementApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    }
  });

  const handleAddAnnouncement = () => {
    createMutation.mutate(newAnnouncement);
  };

  const handleEditAnnouncement = () => {
    if (!currentAnnouncement?.id) return;
    
    updateMutation.mutate({
      id: currentAnnouncement.id,
      data: currentAnnouncement
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Function to truncate text for display in table
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Create and manage system announcements
          </p>
        </div>
        <Dialog open={isAddAnnouncementDialogOpen} onOpenChange={setIsAddAnnouncementDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement to share with users.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={5}
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAnnouncementDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAnnouncement}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>
            Recent and upcoming system announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{truncateText(announcement.content, 50)}</TableCell>
                  <TableCell>{announcement.createdBy}</TableCell>
                  <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(announcement.updatedAt).toLocaleDateString()}</TableCell>
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
                            setCurrentAnnouncement(announcement);
                            setIsViewAnnouncementDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentAnnouncement(announcement);
                            setIsEditAnnouncementDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
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

      {/* View Announcement Dialog */}
      {currentAnnouncement && (
        <Dialog open={isViewAnnouncementDialogOpen} onOpenChange={setIsViewAnnouncementDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{currentAnnouncement.title}</DialogTitle>
              <DialogDescription>
                Posted by {currentAnnouncement.createdBy} on {new Date(currentAnnouncement.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-muted p-4 whitespace-pre-wrap">
                {currentAnnouncement.content}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewAnnouncementDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Announcement Dialog */}
      {currentAnnouncement && (
        <Dialog open={isEditAnnouncementDialogOpen} onOpenChange={setIsEditAnnouncementDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Update the announcement details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentAnnouncement.title}
                  onChange={(e) =>
                    setCurrentAnnouncement({
                      ...currentAnnouncement,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  rows={5}
                  value={currentAnnouncement.content}
                  onChange={(e) =>
                    setCurrentAnnouncement({
                      ...currentAnnouncement,
                      content: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditAnnouncementDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAnnouncement}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
