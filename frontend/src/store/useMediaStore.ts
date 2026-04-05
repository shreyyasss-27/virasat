import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { type Media } from "@/types/Media";

interface MediaStore {
  mediaList: Media[];

  isUploadingVideo: boolean;
  isUploadingImage: boolean;

  uploadMedia: (
    file: File,
    moduleName: "bhartiyam" | "heritageBazzar" | "sangam" | "dharoharTv" | "profile"
  ) => Promise<void>;

  deleteMedia: (mediaId: string) => Promise<void>;
  resetMedia: () => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  mediaList: [],

  isUploadingVideo: false,
  isUploadingImage: false,

  uploadMedia: async (file, moduleName) => {
    const isVideo = file.type.startsWith("video/");

    set({
      isUploadingVideo: isVideo,
      isUploadingImage: !isVideo,
    });

    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("moduleName", moduleName);

      const res = await axiosInstance.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        mediaList: [res.data.media, ...state.mediaList],
      }));

      toast.success("Media uploaded!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      set({
        isUploadingVideo: false,
        isUploadingImage: false,
      });
    }
  },

  deleteMedia: async (mediaId) => {
    await axiosInstance.delete(`/media/${mediaId}`);
    set((state) => ({
      mediaList: state.mediaList.filter((m) => m._id !== mediaId),
    }));
  },

  resetMedia: () => set({ mediaList: [] }),
}));
