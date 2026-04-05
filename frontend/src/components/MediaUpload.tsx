import React, { useRef } from "react";
import { useMediaStore } from "@/store/useMediaStore";
import { Loader2, UploadCloud } from "lucide-react";

interface UploadProps {
  type: "image" | "video";
  module: "bhartiyam" | "heritageBazzar" | "sangam" | "dharoharTv" | "profile";
}

const MediaUpload: React.FC<UploadProps> = ({ type, module }) => {
  const {
    uploadMedia,
    isUploadingVideo,
    isUploadingImage,
  } = useMediaStore();

  const isUploading = type === "video" ? isUploadingVideo : isUploadingImage;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadMedia(file, module);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
      <input
        ref={fileInputRef}
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50 dark:text-black"
      >
        {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
        {isUploading ? `Uploading ${type}...` : `Upload ${type}`}
      </button>
    </div>
  );
};

export default MediaUpload;
