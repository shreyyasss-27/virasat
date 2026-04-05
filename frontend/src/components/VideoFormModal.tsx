import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVideoStore } from "@/store/useVideoStore";
import { useMediaStore } from "@/store/useMediaStore";
import MediaUpload from "./MediaUpload.tsx";
import { X, Film, Image as ImageIcon, Loader2 } from "lucide-react";

export function VideoFormModal({ isOpen, onClose, initialData }: any) {
  const { createVideo, updateVideo, isSaving: isStoreSaving } = useVideoStore();
  const {mediaList, resetMedia, isUploadingVideo, isUploadingImage} = useMediaStore();


  const emptyForm = {
    title: "",
    category: "",
    duration: 0,
    description: "",
    videoUrl: "",
    mediaId: null as string | null,
    thumbnailUrl: "",
    thumbnailMediaId: null as string | null,
    tags: "" as string, // Handled as string for easy typing, then converted to array on submit
  };

  const [formData, setFormData] = useState(emptyForm);

  // Helper to extract duration from video URL
  const calculateVideoDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
      };
      video.onerror = () => resolve(0);
    });
  };

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "",
        duration: initialData.duration || 0,
        description: initialData.description || "",
        videoUrl: initialData.videoData?.url || "",
        mediaId: initialData.videoData?.mediaId || null,
        thumbnailUrl: initialData.thumbnail?.url || "",
        thumbnailMediaId: initialData.thumbnail?.mediaId || null,
        tags: initialData.tags?.join(", ") || "",
      });
    } else if (isOpen) {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  // Handle media uploads and auto-calculate duration
  // useEffect(() => {
  //   const handleLatestMedia = async () => {
  //     if (mediaList.length > 0) {
  //       const latestMedia = mediaList[0];
  //       const isVideo = latestMedia.resource_type === "video" || latestMedia.format === "mp4";

  //       if (isVideo) {
  //         const autoDuration = await calculateVideoDuration(latestMedia.url);
  //         setFormData((prev) => ({
  //           ...prev,
  //           videoUrl: latestMedia.url,
  //           mediaId: latestMedia._id,
  //           duration: autoDuration > 0 ? autoDuration : prev.duration,
  //         }));
  //       } else {
  //         setFormData((prev) => ({
  //           ...prev,
  //           thumbnailUrl: latestMedia.url,
  //           thumbnailMediaId: latestMedia._id,
  //         }));
  //       }
  //     }
  //   };

  //   handleLatestMedia();
  // }, [mediaList]);

  // Inside VideoFormModal.tsx
  useEffect(() => {
    if (mediaList.length > 0) {
      // Get the most recent upload that hasn't been assigned yet
      const latestMedia = mediaList[0];
      const isVideo = latestMedia.url.includes("/video/upload") || latestMedia.resource_type === "video";

      setFormData((prev) => {
        // Avoid overwriting if this specific mediaId is already present
        if (latestMedia._id === prev.mediaId || latestMedia._id === prev.thumbnailMediaId) {
          return prev;
        }

        if (isVideo) {
          // Calculate duration only for new videos
          calculateVideoDuration(latestMedia.url).then(dur => {
            setFormData(current => ({ ...current, duration: dur }));
          });
          return { ...prev, videoUrl: latestMedia.url, mediaId: latestMedia._id };
        } else {
          return { ...prev, thumbnailUrl: latestMedia.url, thumbnailMediaId: latestMedia._id };
        }
      });
    }
  }, [mediaList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const clearMedia = (type: "video" | "thumbnail") => {
    setFormData((prev) => ({
      ...prev,
      ...(type === "video"
        ? { videoUrl: "", mediaId: null, duration: 0 }
        : { thumbnailUrl: "", thumbnailMediaId: null }
      ),
    }));
    resetMedia();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert tags string to array
    const submissionData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : []
    };

    if (initialData) {
      await updateVideo(initialData._id, submissionData);
    } else {
      await createVideo(submissionData);
    }
    handleClose();
  };

  const handleClose = () => {
    resetMedia();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Refine Heritage Content" : "Upload to DharoharTV"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Traditional Weaving of Varanasi" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange} value={formData.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {["History", "Mythology", "Culture", "Geography", "Festival", "Philosophy"].map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex justify-between">
                Duration (sec)
                {formData.duration > 0 && <span className="text-[10px] text-green-600 font-bold">AUTO-DETECTED</span>}
              </Label>
              <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Film size={16} className="text-purple-600" /> Video Source</Label>
            {!formData.videoUrl ? (
              <MediaUpload type="video" module="dharoharTv" />
            ) : (
              <div className="relative p-3 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-2 bg-purple-600 rounded-lg text-white"><Film size={14} /></div>
                  {/* <span className="text-xs truncate font-medium">{formData.videoUrl}</span> */}
                  <span className="text-xs truncate font-medium">Video uploaded successfully</span>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => clearMedia("video")}>
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><ImageIcon size={16} className="text-purple-600" /> Cover Thumbnail</Label>
            {!formData.thumbnailUrl ? (
              <MediaUpload type="image" module="dharoharTv" />
            ) : (
              <div className="relative aspect-video w-full group">
                <img src={formData.thumbnailUrl} alt="preview" className="h-full w-full object-cover rounded-xl border-2 border-purple-100" />
                <button type="button" onClick={() => clearMedia("thumbnail")} className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="history, veda, ritual" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="h-28 resize-none" />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg font-semibold" disabled={isStoreSaving || isUploadingVideo || isUploadingImage || !formData.videoUrl}>
            {isStoreSaving ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving to Database...</>
            ) : isUploadingVideo || isUploadingImage ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Media...</>
            ) : initialData ? "Update Video Details" : "Publish to DharoharTV"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}