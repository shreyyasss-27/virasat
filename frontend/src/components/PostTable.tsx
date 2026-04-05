import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Image as ImageIcon, Video, FileText } from "lucide-react";
import { type Post, usePostStore } from "@/store/usePostStore";

export function PostTable({ posts, onEdit }: { posts: Post[], onEdit: (p: Post) => void }) {
  const { deletePost, isActionLoading } = usePostStore();

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-6 w-6 text-muted-foreground" />;
      case 'pdf': return <FileText className="h-6 w-6 text-muted-foreground" />;
      default: return <ImageIcon className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Media</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reactions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No posts found.</TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <div className="h-12 w-12 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                    {post.media?.url && post.media.fileType === 'image' ? (
                      <img src={post.media.url} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      getMediaIcon(post.media?.fileType || 'none')
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                    <p className="font-semibold">{post.title}</p>
                </TableCell>
                <TableCell>{typeof post.description === 'string' ? `${post.description.slice(0, 80)}...` : "Rich Text Content"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${post.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {post.isPublic ? 'Public' : 'Private'}
                  </span>
                </TableCell>
                <TableCell>{post.reactions?.length || 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    disabled={isActionLoading}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this post?")) {
                        deletePost(post._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}