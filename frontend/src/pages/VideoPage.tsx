import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useVideoStore } from "@/store/useVideoStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Eye, Share2, MessageCircle, ArrowLeft, Maximize } from "lucide-react";
import { toast } from "sonner";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { video, fetchVideoById, toggleLike, addComment, isLoading } = useVideoStore();
  const { authUser  } = useAuthStore();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) fetchVideoById(id);
  }, [id, fetchVideoById]);

  const handleLike = async () => {
    if (!authUser) return toast.error("Please login to like videos");
    if (id) await toggleLike(id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return toast.error("Please login to comment");
    if (!commentText.trim()) return;

    if (id) {
      await addComment(id, commentText);
      setCommentText("");
      toast.success("Comment added!");
    }
  };

  if (isLoading || !video) {
    return <VideoPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to DharoharTV
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Section */}
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10 group">
              <video
                src={video.videoData?.url}
                poster={video.thumbnail?.url}
                controls
                className="h-full w-full object-contain"
                onPlay={() => {/* Increment views logic already in backend */}}
              />
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight uppercase tracking-tight">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Eye className="h-4 w-4" />  {(video.views?.length || 0).toLocaleString()} views
                    </span>
                    <Badge variant="secondary" className="rounded-full">{video.category}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant={video.likes.includes(authUser?._id || "") ? "default" : "outline"} 
                    className="rounded-full gap-2 transition-all active:scale-95"
                    onClick={handleLike}
                  >
                    <Heart className={`h-5 w-5 ${video.likes.includes(authUser?._id || "") ? "fill-current" : ""}`} />
                    {video.likes.length}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-muted">
                <p className="text-sm font-semibold mb-2">Uploaded by {video.creator?.firstName} {video.creator?.lastName}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> {video.comments?.length || 0} Comments
              </h3>
              
              <form onSubmit={handleComment} className="flex gap-3">
                <Input 
                  placeholder="Add a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="rounded-full bg-muted/50"
                />
                <Button type="submit" className="rounded-full px-6">Post</Button>
              </form>

              <div className="space-y-6 pt-4">
                {video.comments?.map((c: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 uppercase shrink-0">
                      {c.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{c.user?.firstName} {c.user?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Suggested/Related - Optional) */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-muted-foreground uppercase text-xs tracking-widest">More from DharoharTV</h4>
            <p className="text-sm text-muted-foreground italic">Related heritage videos appearing here soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-8">
      <Skeleton className="h-[450px] w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}