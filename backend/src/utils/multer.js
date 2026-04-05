import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (videos)
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")  
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video allowed"), false);
    }
  },
});

export default upload;
