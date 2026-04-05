import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { useVideoStore, type Video } from "@/store/useVideoStore";
import { Link } from "react-router";

interface VideoTableProps {
  videos: Video[];
  onEdit: (video: Video) => void;
}

export function VideoTable({ videos, onEdit }: VideoTableProps) {
  const { deleteVideo, isSaving } = useVideoStore();

  return (
    <div className="border-t">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {videos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No heritage videos found. Start by uploading one!
              </TableCell>
            </TableRow>
          ) : (
            videos.map((video) => (
              <TableRow
                key={video._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell>
                  <div className="relative aspect-video w-16 overflow-hidden rounded border bg-muted">
                    <img
                      src={video.thumbnail?.url || "/placeholder.svg"}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium max-w-[200px] truncate">
                  {video.title}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {video.category}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={video.isApproved ? "default" : "secondary"}
                    className={
                      video.isApproved
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {video.isApproved ? "Live" : "Pending Review"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center text-muted-foreground">
                  {video.views.length.toLocaleString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dharohartv/watch/${video._id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(video)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={isSaving}
                      onClick={() => {
                        if (
                          window.confirm(
                            "This will permanently delete the video and its media from Cloudinary. Continue?"
                          )
                        ) {
                          deleteVideo(video._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
