import React, { useRef } from "react";
import { useMediaStore } from "@/store/useMediaStore.ts";
import { Loader2, UploadCloud } from "lucide-react";

interface UploadProps {
  module: "bhartiyam" | "heritageBazzar" | "sangam" | "dharoharTv" | "profile";
}

const MediaUpload: React.FC<UploadProps> = ({ module }) => {
  const { uploadMedia, isUploading } = useMediaStore();
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
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <UploadCloud />
        )}
        {isUploading ? "Uploading to " + module : "Upload to " + module}
      </button>
      <p className="text-xs mt-2 text-gray-500">Max size: 50MB (Images/Videos)</p>
    </div>
  );
};

export default MediaUpload;