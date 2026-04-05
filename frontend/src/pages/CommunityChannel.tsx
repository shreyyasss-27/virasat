import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { usePostStore } from "@/store/usePostStore";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Info } from "lucide-react";

export default function CommunityChannel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const { posts, fetchPublicPosts, giveReaction } = usePostStore();
  const { communities, toggleMembership, isActionLoading } = useCommunityStore();

  const currentCommunity = communities.find(c => c._id === id);
  const communityPosts = posts.filter(p => p.communityId?._id === id);

  useEffect(() => {
    fetchPublicPosts();
  }, []);

  const handleLeaveChannel = async () => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to leave ${currentCommunity?.name}?`)) {
      await toggleMembership(id);
      navigate("/sangam");
    }
  };

  return (
    // CHANNEL WIDTH: max-w-5xl provides the container width
    <div className="max-w-5xl mx-auto min-h-screen bg-background dark:bg-slate-950 pb-10 border-x border-border shadow-sm">

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <Button variant="ghost" size="icon" onClick={() => navigate("/sangam")} className="rounded-full shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg leading-tight truncate text-foreground">
                {currentCommunity?.name || "Community Updates"}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate italic">
                {currentCommunity?.description || "Official expert-led channel"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={isActionLoading}
            onClick={handleLeaveChannel}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium text-xs">Leave</span>
          </Button>
        </div>
      </div>

      {/* --- POSTS LIST --- */}
      <div className="p-4 flex flex-col items-center space-y-6">
        {communityPosts.length === 0 ? (
          <div className="w-full max-w-2xl text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <Info className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No updates posted yet.</p>
          </div>
        ) : (
          communityPosts.map((post) => {
            // FIXED: Checking r.userId (string) or r.userId._id (object)
            const userReaction = post.reactions?.find(r =>
              (typeof r.userId === 'string' ? r.userId : r.userId) === authUser?._id
            );

            return (
              // POST WIDTH: Centered and constrained to max-w-2xl
              <article key={post._id} className="w-full max-w-2xl bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 md:p-5 space-y-3">
                  <h3 className="text-lg font-bold tracking-tight leading-snug">
                    {post.title}
                  </h3>

                  {post.media?.url && (
                    <div className="rounded-lg overflow-hidden bg-muted border border-border flex justify-center">
                      <img
                        src={post.media.url}
                        className="max-h-[400px] w-full object-cover"
                        alt="post content"
                      />
                    </div>
                  )}

                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {post.description}
                  </div>

                  {/* --- REACTIONS BAR --- */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border">
                    {[
                      { emoji: "👍" },
                      { emoji: "❤️" },
                      { emoji: "😂" },
                      { emoji: "😢" },
                      { emoji: "😡" },
                      { emoji: "👎" }
                    ].map((react) => {
                      // FIXED: Filtering by react.emoji to match your JSON data
                      const count = post.reactions?.filter(r => r.emoji === react.emoji).length || 0;
                      const isSelected = userReaction?.emoji === react.emoji;

                      return (
                        <Button
                          key={react.emoji}
                          variant="secondary"
                          size="sm"
                          className={`rounded-full gap-1 h-7 px-2.5 transition-all active:scale-95 border ${isSelected
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
                              : "bg-muted border-transparent hover:bg-accent text-muted-foreground"
                            }`}
                          onClick={() => giveReaction(post._id, react.emoji)}
                        >
                          <span className="text-sm">{react.emoji}</span>
                          <span className={`text-[10px] font-bold ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>
                            {count}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}