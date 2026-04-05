import { useEffect, useState, useMemo } from "react";
import { useVideoStore } from "@/store/useVideoStore";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Video, BarChart3, Clock, Heart } from "lucide-react";
import { VideoTable } from "@/components/VideoTable";
import { VideoFormModal } from "@/components/VideoFormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatorDashboard() {
  const { videos, isLoading, fetchVideosByCreator } = useVideoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  useEffect(() => {
    fetchVideosByCreator();
  }, [fetchVideosByCreator]);

  // Optimized stats calculation using useMemo
  const stats = useMemo(() => {
    const totalViews = videos.reduce((acc, curr) => acc + (curr.views?.length || 0), 0);

    // Correctly accessing likes.length since it's an array of User IDs
    const totalLikes = videos.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);

    // Dynamic average duration based on duration field (in seconds)
    const totalDuration = videos.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const avgDurationSeconds = videos.length > 0 ? totalDuration / videos.length : 0;

    return { totalViews, totalLikes, avgDurationSeconds };
  }, [videos]);

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const formatDurationDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Creator Studio
          </h1>
          <p className="text-muted-foreground">
            Manage your DharoharTV content and analyze audience reach.
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Upload New Video
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Video className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Videos published</p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all content</p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total likes received</p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDurationDisplay(stats.avgDurationSeconds)}</div>
            <p className="text-xs text-muted-foreground mt-1">Calculated per video</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h2 className="font-semibold">Manage Videos</h2>
        </div>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading studio data...</p>
          </div>
        ) : videos.length > 0 ? (
          <VideoTable videos={videos} onEdit={handleEdit} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">You haven't uploaded any videos yet.</p>
            <Button variant="outline" onClick={handleAddNew}>Upload your first video</Button>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      <VideoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingVideo}
      />
    </div>
  );
}