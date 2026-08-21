import multer from "multer";

// We use memoryStorage so the image stays in a Buffer
// Then we pass it to sharp for processing before uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Only JPEG, PNG, and WebP are allowed."));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});
