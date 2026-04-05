import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

// Stores
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Calendar, Share2, ThumbsUp 
} from "lucide-react";
import { toast } from "sonner";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { selectedPost, fetchPostById, giveReaction, isLoading } = usePostStore();

  useEffect(() => {
    if (id) fetchPostById(id);
  }, [id, fetchPostById]);

  const handleReaction = async () => {
    if (!id) return;
    await giveReaction(id, "👍");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) return <PostSkeleton />;
  if (!selectedPost) return <NotFound />;

  const hasReacted = selectedPost.reactions?.some(r => r.userId === authUser?._id);

  // BUG FIX: Derive community name/niche if backend hasn't enriched them yet
  const communityName = selectedPost.communityId?.name || `${selectedPost.headId?.name}'s Community`;
  const niche = selectedPost.communityId?.niche || "Expert";

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl">
      {/* Back Button - Fixed hover for dark mode */}
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 hover:bg-accent text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-3 py-1">
              {communityName}
            </Badge>
            {/* Dark mode fix: Changed text-slate-900 to text-foreground */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Media Section */}
          {selectedPost.media?.url && (
            <div className="rounded-3xl overflow-hidden border bg-muted aspect-video shadow-sm">
              {selectedPost.media.fileType === 'video' ? (
                <video src={selectedPost.media.url} controls className="w-full h-full" />
              ) : (
                <img 
                  src={selectedPost.media.url} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Post Description - Dark mode fix: Changed text-slate-700 to text-foreground/90 */}
          <div className="text-foreground/90 leading-relaxed text-lg whitespace-pre-wrap">
            {selectedPost.description}
          </div>

          <hr className="my-8 opacity-20" />

          {/* Interaction Bar */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleReaction}
              variant={hasReacted ? "default" : "outline"}
              className={`rounded-full gap-2 transition-all ${hasReacted ? 'bg-primary hover:opacity-90' : ''}`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasReacted ? 'fill-current' : ''}`} />
              <span>{selectedPost.reactions?.length || 0}</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" onClick={copyLink}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar: Expert Info */}
        <div className="space-y-6">
          {/* Dark mode fix: Removed bg-white, use default card background */}
          <Card className="rounded-3xl border border-border shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4">Author</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground font-bold text-xl overflow-hidden">
                  {selectedPost.headId?.profileImage ? (
                    <img src={selectedPost.headId.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    selectedPost.headId?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight text-foreground">{selectedPost.headId?.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{niche}</p>
                </div>
              </div>
              <Button 
                className="w-full rounded-xl"
                variant="outline"
                onClick={() => navigate(`/communities/${selectedPost.communityId?._id}`)}
              >
                View Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function PostSkeleton() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl space-y-6">
      <Skeleton className="h-10 w-24 rounded-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Post not found</h2>
      <p className="text-muted-foreground mb-4">This content may have been deleted.</p>
      <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );
}