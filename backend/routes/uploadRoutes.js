import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage - file is held in RAM temporarily then streamed to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp|gif/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Stream buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'rsr-collections',
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    // Return the secure https Cloudinary URL
    res.json(result.secure_url);
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

export default router;
