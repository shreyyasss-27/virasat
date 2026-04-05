import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

// Stores
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useAuthStore } from "@/store/useAuthStore";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Info
} from "lucide-react";

export default function DiscussionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const {
    selectedDiscussion,
    fetchDiscussionById,
    addReply,
    toggleUpvote,
    resolveDiscussion,
    isLoading,
    isActionLoading
  } = useDiscussionStore();

  const [replyText, setReplyText] = useState("");

  // Format Date Helper: DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB").format(date);
  };

  useEffect(() => {
    if (id) fetchDiscussionById(id);
  }, [id, fetchDiscussionById]);

  const handleReply = async () => {
    if (!replyText.trim() || !id) return;
    await addReply(id, replyText);
    setReplyText("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!selectedDiscussion) return null;

  const isAuthor = authUser?._id === selectedDiscussion.userId?._id;
  const hasUpvoted = selectedDiscussion.upvotes.includes(authUser?._id || "");

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="group rounded-full gap-2 hover:bg-transparent p-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Sangam</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

        {/* LEFT COLUMN: Question + Replies */}
        <div className="md:col-span-2 space-y-8">

          {/* Main Question Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 border">
                  {/* UPDATED: Path matches JSON structure */}
                  <AvatarImage src={selectedDiscussion.userId?.profilePic?.url} />
                  <AvatarFallback>
                    {selectedDiscussion.userId?.firstName?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* UPDATED: Using firstName and lastName */}
                <span className="text-sm font-semibold">
                  {selectedDiscussion.userId?.firstName} {selectedDiscussion.userId?.lastName}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-xs">{formatDate(selectedDiscussion.createdAt)}</span>
              </div>
              {selectedDiscussion.isResolved && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 rounded-full px-3 dark:bg-white">
                  <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-balance">
              {selectedDiscussion.questionTitle}
            </h1>

            <p className="text-foreground/80 text-base leading-relaxed whitespace-pre-wrap">
              {selectedDiscussion.questionDetails}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full gap-2 h-9 px-4 border ${hasUpvoted ? 'bg-blue-50 border-blue-200 text-blue-600' : 'hover:bg-muted'}`}
                onClick={() => toggleUpvote(selectedDiscussion._id)}
              >
                <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                <span className="font-bold">{selectedDiscussion.upvotes.length}</span>
              </Button>

              {isAuthor && !selectedDiscussion.isResolved && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 px-4 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => resolveDiscussion(selectedDiscussion._id)}
                  disabled={isActionLoading}
                >
                  Mark as Resolved
                </Button>
              )}
            </div>
          </section>

          <hr className="border-border/60" />

          {/* Replies Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold">Replies</h3>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {selectedDiscussion.replies?.length || 0} Total
              </span>
            </div>

            <div className="space-y-6">
              {selectedDiscussion.replies.map((reply) => (
                <div key={reply._id} className="group flex gap-4 transition-all">
                  <Avatar className="w-9 h-9 shrink-0 border mt-1">
                    {/* UPDATED: Path matches JSON structure */}
                    <AvatarImage src={reply.userId?.profilePic?.url} />
                    <AvatarFallback>
                      {reply.userId?.firstName?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      {/* UPDATED: Using firstName and lastName */}
                      <span className="text-sm font-bold">
                        {reply.userId?.firstName} {reply.userId?.lastName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-4 rounded-2xl rounded-tl-none group-hover:bg-muted/50 transition-colors">
                      {reply.text}
                    </p>
                  </div>
                </div>
              ))}

              {selectedDiscussion.replies.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No replies yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Minimalist Reply Sidebar */}
        <div className="md:sticky md:top-8 space-y-6">
          <div className="p-6 rounded-3xl border bg-card/50 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border">
                {/* Ensure authUser follows the same profilePic logic */}
                <AvatarImage src={authUser?.profilePic?.url} />
                <AvatarFallback>{authUser?.firstName?.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-bold leading-none">Your Reply</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Replying as {authUser?.firstName}</p>
              </div>
            </div>

            <Textarea
              placeholder="What are your thoughts?"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[180px] bg-transparent border-muted-foreground/20 focus-visible:ring-blue-500 rounded-2xl resize-none text-sm p-4"
            />

            <Button
              onClick={handleReply}
              disabled={isActionLoading || !replyText.trim()}
              className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-11 font-semibold text-sm transition-all"
            >
              {isActionLoading ? "Posting..." : "Post Reply"}
            </Button>

            <div className="flex gap-2 p-3 bg-muted/40 rounded-xl">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Your reply will be visible to everyone in the Sangam community.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}