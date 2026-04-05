import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Stores
import { useCommunityStore } from "@/store/useCommunityStore";
import { usePostStore } from "@/store/usePostStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useAuthStore } from "@/store/useAuthStore";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Users,
  ArrowRight,
  ThumbsUp,
  PlusCircle,
  Clock
} from "lucide-react";

export default function Sangam() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { authUser } = useAuthStore();

  // Persistence Logic: Get active tab from URL or default to "posts"
  const activeTab = searchParams.get("tab") || "posts";

  // Store States
  const {
    communities,
    searchResults,
    fetchCommunities,
    searchCommunities,
    toggleMembership,
    isActionLoading: commActionLoading,
    isLoading: commLoading
  } = useCommunityStore();

  const { posts, fetchPublicPosts, isLoading: postsLoading } = usePostStore();

  const {
    discussions,
    fetchDiscussions,
    createQuestion,
    isLoading: discLoading,
    isActionLoading: discActionLoading
  } = useDiscussionStore();

  // Local UI States
  const [postSearch, setPostSearch] = useState("");
  const [commSearch, setCommSearch] = useState("");
  const [discSearch, setDiscSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDisc, setNewDisc] = useState({ title: "", details: "" });

  const isCommunityHead = authUser?.roles?.includes("EXPERT");

  // Initial Data Fetch
  useEffect(() => {
    fetchPublicPosts();
    fetchCommunities();
    fetchDiscussions();
  }, [fetchPublicPosts, fetchCommunities, fetchDiscussions]);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Debounced Searches
  useEffect(() => {
    const timer = setTimeout(() => fetchPublicPosts(postSearch), 500);
    return () => clearTimeout(timer);
  }, [postSearch, fetchPublicPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (commSearch.trim()) searchCommunities(commSearch);
      else fetchCommunities();
    }, 500);
    return () => clearTimeout(timer);
  }, [commSearch, searchCommunities, fetchCommunities]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDiscussions(discSearch), 500);
    return () => clearTimeout(timer);
  }, [discSearch, fetchDiscussions]);

  const handleCreateDiscussion = async () => {
    if (!newDisc.title.trim()) return;
    try {
      await createQuestion({
        questionTitle: newDisc.title,
        questionDetails: newDisc.details,
      });
      setIsDialogOpen(false);
      setNewDisc({ title: "", details: "" });
    } catch (error) {
      console.error("Failed to create discussion", error);
    }
  };

  const displayCommunities = commSearch.trim() ? searchResults : communities;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8 bg-background text-foreground min-h-screen">

      {/* --- START DISCUSSION DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Start a Discussion</DialogTitle>
            <DialogDescription>
              Share your heritage queries or thoughts with the Sangam community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Title</label>
              <Input
                placeholder="What would you like to discuss?"
                value={newDisc.title}
                onChange={(e) => setNewDisc({ ...newDisc, title: e.target.value })}
                className="rounded-xl border-muted-foreground/20 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Details (Optional)</label>
              <Textarea
                placeholder="Provide context or background..."
                value={newDisc.details}
                onChange={(e) => setNewDisc({ ...newDisc, details: e.target.value })}
                className="rounded-xl min-h-[120px] resize-none border-muted-foreground/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full">Cancel</Button>
            <Button
              onClick={handleCreateDiscussion}
              disabled={discActionLoading || !newDisc.title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg shadow-blue-500/20"
            >
              {discActionLoading ? "Posting..." : "Post Discussion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Sangam</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Verified Heritage Portal
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-md">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-full border border-border">
              <TabsTrigger value="posts" className="rounded-full transition-all">Posts</TabsTrigger>
              <TabsTrigger value="communities" className="rounded-full transition-all">Communities</TabsTrigger>
              <TabsTrigger value="discussions" className="rounded-full transition-all">Discussions</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-3 min-w-[200px] justify-end">
            {isCommunityHead && (
              <Button onClick={() => navigate("/sangam/dashboard")} variant="outline" className="rounded-full border-blue-500/30 text-blue-600 gap-2 hover:bg-blue-50">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* --- POSTS TAB --- */}
        <TabsContent value="posts" className="space-y-6 outline-none">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search heritage updates..."
              className="pl-10 rounded-xl bg-card border-border"
              value={postSearch}
              onChange={(e) => setPostSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {postsLoading ? Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />) :
              posts.map((post) => (
                <Card
                  key={post._id}
                  className="overflow-hidden rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  {post.media?.url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img src={post.media.url} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <CardContent className="p-4 flex flex-col flex-1 gap-2">
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{post.description}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border">
                      <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                        <ThumbsUp className="w-3 h-3" /> {post.reactions?.length || 0}
                      </div>
                      <span className="text-[10px] text-muted-foreground italic">By {post.headId?.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </TabsContent>

        {/* --- COMMUNITIES TAB --- */}
        <TabsContent value="communities" className="space-y-6 outline-none">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Find a community..."
              className="pl-10 rounded-xl bg-card"
              value={commSearch}
              onChange={(e) => setCommSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)
            ) : (
              displayCommunities.map((comm) => (
                <Card key={comm._id} className="p-5 rounded-2xl border-border bg-card flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                        <Users className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                        {comm.niche}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{comm.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{comm.description}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {comm.isMember ? (
                      <Button
                        onClick={() => navigate(`/sangam/communities/${comm._id}`)}
                        className="w-full rounded-xl h-10 text-xs font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all flex items-center justify-center gap-2"
                      >
                        View Community <ArrowRight className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        disabled={commActionLoading}
                        onClick={() => toggleMembership(comm._id)}
                        className="w-full rounded-xl h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/10"
                      >
                        {commActionLoading ? "Joining..." : "Join Community"}
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* --- DISCUSSIONS TAB --- */}
        <TabsContent value="discussions" className="space-y-6 outline-none">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search community discussions..."
                className="pl-10 rounded-xl bg-card border-border"
                value={discSearch}
                onChange={(e) => setDiscSearch(e.target.value)}
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md shadow-blue-500/20 gap-2 font-semibold"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="w-4 h-4" /> Start a Discussion
            </Button>
          </div>

          <div className="grid gap-4">
            {discLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />) :
              discussions.map((disc) => (
                <Card
                  key={disc._id}
                  className="p-6 rounded-2xl border-border bg-card hover:bg-muted/40 transition-all cursor-pointer shadow-sm border group"
                  onClick={() => navigate(`/sangam/discussions/${disc._id}`)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600">@{disc.userId?.username}</span>
                        <span className="text-muted-foreground text-[10px]">•</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(disc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">{disc.questionTitle}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium"><MessageSquare className="w-4 h-4" /> {disc.replies?.length || 0} Replies</span>
                        <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {disc.upvotes?.length || 0} Likes</span>
                      </div>
                    </div>
                    {disc.isResolved && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 shrink-0">Resolved</Badge>
                    )}
                  </div>
                </Card>
              ))
            }
            {!discLoading && discussions.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">No discussions found.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}