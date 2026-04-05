import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostStore } from "@/store/usePostStore";
import { useMediaStore } from "@/store/useMediaStore";
import MediaUpload from "./MediaUpload"; // Adjusted path
import { X, Film, ImageIcon } from "lucide-react";

export function PostFormModal({ isOpen, onClose, initialData }: any) {
  const { createPost, updatePost, isActionLoading } = usePostStore();
  const { mediaList, resetMedia } = useMediaStore();
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

  const emptyForm = {
    title: "",
    description: "",
    isPublic: true,
    media: { url: "", fileType: 'none' as any, fileName: "", mediaId: "" },
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (mediaList.length > 0) {
      const latest = mediaList[0];
      setFormData((prev) => ({
        ...prev,
        media: {
          url: latest.url,
          fileType: uploadType,
          fileName: (latest as any).original_filename || "upload",
          mediaId: (latest as any).public_id || ""
        },
      }));
    }
  }, [mediaList, uploadType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await updatePost(initialData._id, formData);
    } else {
      await createPost(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    resetMedia();
    setFormData(emptyForm);
    onClose();
  };

  const clearMedia = () => {
    setFormData(prev => ({ ...prev, media: emptyForm.media }));
    resetMedia();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>Public Visibility</Label>
            <Switch 
              checked={formData.isPublic} 
              onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})} 
            />
          </div>

          <div className="space-y-3">
            <Label>Media Attachment</Label>
            {!formData.media.url ? (
              <div className="space-y-3">
                <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image"><ImageIcon className="w-4 h-4 mr-2" /> Image</TabsTrigger>
                    <TabsTrigger value="video"><Film className="w-4 h-4 mr-2" /> Video</TabsTrigger>
                  </TabsList>
                </Tabs>
                <MediaUpload type={uploadType} module="sangam" />
              </div>
            ) : (
              <div className="relative rounded-md border p-2 bg-muted/50">
                {formData.media.fileType === 'image' ? (
                  <img src={formData.media.url} className="h-40 w-full object-cover rounded-md" alt="Preview" />
                ) : (
                  <video src={formData.media.url} className="h-40 w-full rounded-md" controls />
                )}
                <Button 
                  type="button" variant="destructive" size="icon" 
                  className="absolute -top-2 -right-2 h-7 w-7" 
                  onClick={clearMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Content</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="min-h-[100px]" required 
            />
          </div>

          <Button type="submit" className="w-full" disabled={isActionLoading}>
            {isActionLoading ? "Saving..." : initialData ? "Update Post" : "Broadcast Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}