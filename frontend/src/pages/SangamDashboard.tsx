import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { PostTable } from "@/components/PostTable";
import { PostFormModal } from "@/components/PostFormModal";
import { usePostStore } from "@/store/usePostStore";

export default function SangamDashboard() {
  const { posts, isLoading, fetchPublicPosts } = usePostStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    fetchPublicPosts();
  }, [fetchPublicPosts]);

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Dashboard</h1>
          <p className="text-muted-foreground">Manage your community and broadcasts.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <PostTable posts={posts} onEdit={handleEdit} />
      )}

      <PostFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingPost} 
      />
    </div>
  );
}