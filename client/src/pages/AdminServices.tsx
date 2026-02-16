import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function AdminServices() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    icon: "BookOpen",
    orderIndex: 0,
    featured: false,
    image: "",
  });

  const utils = trpc.useUtils();
  const { data: services, isLoading } = trpc.services.list.useQuery();
  const createMutation = trpc.services.create.useMutation();
  const updateMutation = trpc.services.update.useMutation();
  const deleteMutation = trpc.services.delete.useMutation();
  const seedMutation = trpc.services.seed.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Check admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      setLocation("/solupedia-admin");
      return;
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingService) {
        // Update existing service
        await updateMutation.mutateAsync({
          id: editingService.id,
          updates: formData,
        });
        toast.success("Service updated successfully!");
        setShowForm(false);
        resetForm();
        utils.invalidate("services.list");
        setIsSubmitting(false);
        return;
      }

      // Generate slug from name if not provided
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      await createMutation.mutateAsync({
        ...formData,
        slug,
      });

      toast.success("Service created successfully!");
      setShowForm(false);
      resetForm();
      utils.invalidate("services.list");
      setIsSubmitting(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create service");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(id);

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Service deleted successfully!");
      utils.invalidate("services.list");
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete service");
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      icon: "BookOpen",
      orderIndex: 0,
      featured: false,
      image: "",
    });
    setEditingService(null);
  };

  const openEditForm = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      slug: service.slug || "",
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      icon: service.icon || "BookOpen",
      orderIndex: service.orderIndex || 0,
      featured: service.featured || false,
      image: service.image || "",
    });
    setShowForm(true);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Filter services based on search query
  const filteredServices = services?.filter(
    (service: any) =>
      service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Services Management
                </h1>
                <p className="text-gray-600">Add, edit, or remove services</p>
              </div>
            </div>
            <Button
              onClick={openNewForm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
            <Button
              onClick={async () => {
                setIsSeeding(true);
                try {
                  await seedMutation.mutateAsync({});
                  toast.success("Services seeded successfully!");
                  utils.invalidate("services.list");
                } catch (error: any) {
                  toast.error(error?.message || "Failed to seed services");
                }
                setIsSeeding(false);
              }}
              disabled={isSeeding}
              variant="outline"
              className="ml-2"
            >
              {isSeeding ? "Seeding..." : "Seed Services"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredServices?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No services found</p>
            <Button onClick={openNewForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredServices?.map((service: any, idx: number) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {service.shortDescription}
                          </CardDescription>
                        </div>
                        {service.featured && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Order: {service.orderIndex || 0}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(service)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                            disabled={deletingId === service.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Service Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the service details below"
                : "Fill in the details to create a new service"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., eLearning Engineering"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g., elearning-engineering"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={e =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Brief description for cards"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={e =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="BookOpen, Video, Zap, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Display Order</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      orderIndex: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={e =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="/image-path.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Mark as Featured
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingService
                    ? "Update Service"
                    : "Create Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
