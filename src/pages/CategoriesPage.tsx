import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, subcategoryApi, Category, SubCategory } from "@/services/category";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CategoriesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isAddSubCategoryDialogOpen, setIsAddSubCategoryDialogOpen] = useState(false);
  const [isEditSubCategoryDialogOpen, setIsEditSubCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    category: 0,
  });

  const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll
  });

  const { data: subcategories = [], isLoading: isSubCategoriesLoading, error: subcategoriesError } = useQuery({
    queryKey: ['subcategories'],
    queryFn: subcategoryApi.getAll
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddCategoryDialogOpen(false);
      setNewCategory({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditCategoryDialogOpen(false);
      setCurrentCategory(null);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    }
  });

  const createSubCategoryMutation = useMutation({
    mutationFn: subcategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setIsAddSubCategoryDialogOpen(false);
      setNewSubCategory({ name: "", description: "", category: 0 });
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      });
    }
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SubCategory> }) =>
      subcategoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setIsEditSubCategoryDialogOpen(false);
      setCurrentSubCategory(null);
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
    }
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: subcategoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your categories</CardDescription>
          </div>
          <Button onClick={() => setIsAddCategoryDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {isCategoriesLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : categoriesError ? (
            <div className="text-center py-4 text-red-500">
              Error loading categories. Please try again later.
            </div>
          ) : !Array.isArray(categories) || categories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No categories found. Add your first category to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(categories) && categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentCategory(category);
                              setIsEditCategoryDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCategoryMutation.mutate(category.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subcategories</CardTitle>
            <CardDescription>Manage your subcategories</CardDescription>
          </div>
          <Button onClick={() => setIsAddSubCategoryDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </CardHeader>
        <CardContent>
          {isSubCategoriesLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : subcategoriesError ? (
            <div className="text-center py-4 text-red-500">
              Error loading subcategories. Please try again later.
            </div>
          ) : !Array.isArray(subcategories) || subcategories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No subcategories found. Add your first subcategory to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(subcategories) && subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>{subcategory.name}</TableCell>
                    <TableCell>{subcategory.category_name}</TableCell>
                    <TableCell>{subcategory.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentSubCategory(subcategory);
                              setIsEditSubCategoryDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteSubCategoryMutation.mutate(subcategory.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => createCategoryMutation.mutate(newCategory)}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={currentCategory?.name || ""}
                onChange={(e) =>
                  setCurrentCategory(
                    currentCategory
                      ? { ...currentCategory, name: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentCategory?.description || ""}
                onChange={(e) =>
                  setCurrentCategory(
                    currentCategory
                      ? { ...currentCategory, description: e.target.value }
                      : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                currentCategory &&
                updateCategoryMutation.mutate({
                  id: currentCategory.id,
                  data: {
                    name: currentCategory.name,
                    description: currentCategory.description,
                  },
                })
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog
        open={isAddSubCategoryDialogOpen}
        onOpenChange={setIsAddSubCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full rounded-md border border-input px-3 py-2"
                value={newSubCategory.category}
                onChange={(e) =>
                  setNewSubCategory({
                    ...newSubCategory,
                    category: Number(e.target.value),
                  })
                }
              >
                <option value={0}>Select a category</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sub-name">Name</Label>
              <Input
                id="sub-name"
                value={newSubCategory.name}
                onChange={(e) =>
                  setNewSubCategory({ ...newSubCategory, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                id="sub-description"
                value={newSubCategory.description}
                onChange={(e) =>
                  setNewSubCategory({
                    ...newSubCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSubCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => createSubCategoryMutation.mutate(newSubCategory)}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog
        open={isEditSubCategoryDialogOpen}
        onOpenChange={setIsEditSubCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-sub-category">Category</Label>
              <select
                id="edit-sub-category"
                className="w-full rounded-md border border-input px-3 py-2"
                value={currentSubCategory?.category || 0}
                onChange={(e) =>
                  setCurrentSubCategory(
                    currentSubCategory
                      ? {
                          ...currentSubCategory,
                          category: Number(e.target.value),
                        }
                      : null
                  )
                }
              >
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-sub-name">Name</Label>
              <Input
                id="edit-sub-name"
                value={currentSubCategory?.name || ""}
                onChange={(e) =>
                  setCurrentSubCategory(
                    currentSubCategory
                      ? { ...currentSubCategory, name: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-sub-description">Description</Label>
              <Textarea
                id="edit-sub-description"
                value={currentSubCategory?.description || ""}
                onChange={(e) =>
                  setCurrentSubCategory(
                    currentSubCategory
                      ? { ...currentSubCategory, description: e.target.value }
                      : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditSubCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                currentSubCategory &&
                updateSubCategoryMutation.mutate({
                  id: currentSubCategory.id,
                  data: {
                    name: currentSubCategory.name,
                    category: currentSubCategory.category,
                    description: currentSubCategory.description,
                  },
                })
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
