import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Plus, Trash2, Edit2, FileText, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const galleryImages = [
  "/blog-articulate-captivate.webp",
  "/blog-madcap-flare.webp",
  "/blog-video-localization.webp",
  "/Solupedia-creation-solutions.jpg",
  "/Solupedia-document-localization.jpg",
  "/Solupedia-video-editing-localization.jpg",
];

export default function AdminBlog() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Solupedia",
    category: "",
    tags: "",
    featuredImage: "",
    published: true,
  });

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.all.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

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
    try {
      if (editingPost) {
        // Update logic would go here if we add update endpoint
        toast.success("Update functionality coming soon");
        return;
      }

      // Generate slug from title if not provided
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      await createMutation.mutateAsync({
        ...formData,
        slug,
        publishedAt: new Date(),
      });

      toast.success("Blog post created successfully!");
      setShowForm(false);
      resetForm();
      utils.blog.all.invalidate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Blog post deleted successfully!");
      utils.blog.all.invalidate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete blog post");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "Solupedia",
      category: "",
      tags: "",
      featuredImage: "",
      published: true,
    });
    setEditingPost(null);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg"
              >
                <FileText className="text-white" size={20} />
              </motion.div>
              <div>
                <h1 className="font-bold text-gray-900">Blog Management</h1>
                <p className="text-xs text-gray-600">Create and manage blog posts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/dashboard")}
                className="rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} className="mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Bar */}
        <motion.div 
          className="mb-8 max-w-md mx-auto md:mx-0 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full flex flex-col bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">
                      {post.featuredImage && (
                        <div className="w-full h-48 bg-gray-200 overflow-hidden relative group">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <CardHeader className="flex-1 pb-2">
                        <div className="flex items-start justify-between mb-2">
                          {post.category && (
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            post.published
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{post.title}</CardTitle>
                        {post.excerpt && (
                          <CardDescription className="mt-2 line-clamp-2 text-gray-600">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3 pt-0 mt-auto">
                        <div className="text-xs text-gray-500 flex items-center gap-2 border-t border-gray-100 pt-3">
                          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPost(post);
                              setFormData({
                                title: post.title || "",
                                slug: post.slug || "",
                                excerpt: post.excerpt || "",
                                content: post.content || "",
                                author: post.author || "Solupedia",
                                category: post.category || "",
                                tags: post.tags || "",
                                featuredImage: post.featuredImage || "",
                                published: post.published ?? true,
                              });
                              setShowForm(true);
                            }}
                            className="flex-1 rounded-full hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                          >
                            <Edit2 size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="flex-1 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4 font-medium">No blog posts found.</p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Your First Post
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update the blog post details below." : "Fill in the details to create a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated from title"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                required
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((img) => {
                    const selected = formData.featuredImage === img;
                    return (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setFormData({ ...formData, featuredImage: img })}
                        className={`relative rounded-xl overflow-hidden border ${selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"} focus:outline-none`}
                        title={img}
                      >
                        <img src={img} alt="Featured" className="w-full h-24 object-cover" />
                        {selected && (
                          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {formData.featuredImage && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Preview</div>
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <Label htmlFor="published" className="cursor-pointer">Published</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : editingPost ? "Update" : "Create Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
