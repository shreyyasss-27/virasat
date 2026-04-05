import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useVideoStore } from "@/store/useVideoStore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Search, Tv, ShieldCheck, Heart } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const categories = [
  "All",
  "History",
  "Mythology",
  "Culture",
  "Geography",
  "Language",
  "Festival",
  "Philosophy",
  "Other",
];

export default function DharoharTV() {
  const navigate = useNavigate();
  const { videos, fetchVideos, isLoading, pages } = useVideoStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchVideos({
      keyword: search,
      category: category === "All" ? "" : category,
      page
    });
  }, [search, category, page, fetchVideos]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const {authUser} = useAuthStore()
  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              DharoharTV
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Verified Cultural Legacy
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Explore traditions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 rounded-full bg-muted/50 focus-visible:ring-purple-500"
            />
          </div>
          {authUser?.roles.includes("CREATOR") && <Button onClick={() => navigate("/dharohartv/dashboard")} variant="outline" className="rounded-full">
            My Studio
          </Button>}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-start pb-2 border-b">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={cat === category ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`rounded-full px-5 transition-all ${
              cat === category ? "bg-purple-600 hover:bg-purple-700" : ""
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))
          : videos.length > 0
          ? videos.map((video) => (
              <Card
  key={video._id}
  className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-muted bg-card transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
  onClick={() => navigate(`/dharohartv/watch/${video._id}`)}
>
  {/* Thumbnail Container */}
  <div className="relative aspect-video overflow-hidden bg-muted">
    <img
      src={video.thumbnail?.url || "/api/placeholder/400/225"}
      alt={video.title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    
    <div className="absolute bottom-2 right-2">
      <Badge className="bg-black/70 font-mono text-[10px] text-white backdrop-blur-md border-none">
        {formatDuration(video.duration)}
      </Badge>
    </div>

    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
      <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-purple-600/90 text-white transition-transform group-hover:scale-100">
        <Play className="h-6 w-6 fill-current" />
      </div>
    </div>
  </div>

  {/* Content Section */}
  <CardHeader className="p-4 space-y-3">
    <div className="space-y-1">
      <CardTitle className="line-clamp-1 text-base font-bold leading-none transition-colors group-hover:text-purple-600">
        {video.title}
      </CardTitle>
      
      {/* Description - Clamped to 2 lines */}
      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
        {video.description || "No description available for this heritage video."}
      </p>
    </div>

    <div className="flex flex-col gap-2 border-t pt-3">
      {/* Uploader Name */}
      <div className="flex items-center gap-2">
         <span className="text-xs font-semibold text-foreground/80">
          By {video.creator?.firstName} {video.creator?.lastName || "Contributor"}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {(video.views?.length || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-500/80" /> {video.likes?.length || 0}
          </span>
        </div>
        
        <Badge variant="secondary" className="h-5 px-2 text-[9px] uppercase tracking-wider">
          {video.category}
        </Badge>
      </div>
    </div>
  </CardHeader>
</Card>
            ))
          : (
              <div className="col-span-full py-24 text-center space-y-5">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 border-2 border-dashed border-muted">
                  <Tv className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">No heritage videos found</p>
                  <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                </div>
                <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setCategory("All"); }}>
                  Reset Filters
                </Button>
              </div>
            )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-12 border-t">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === 1}
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Prev
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "ghost"}
                size="icon"
                className={`w-9 h-9 rounded-full ${page === i + 1 ? "bg-purple-600" : ""}`}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === pages}
            onClick={() => { setPage((p) => Math.min(pages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}