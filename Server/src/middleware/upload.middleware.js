import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from '../config/env.js';

console.log(' [CLOUDINARY CONFIG] Cloud Name:', env.cloudinary.cloudName);
console.log(' [CLOUDINARY CONFIG] API Key:', env.cloudinary.apiKey ? 'PRESENT' : 'MISSING');
console.log(' [CLOUDINARY CONFIG] API Secret:', env.cloudinary.apiSecret ? 'PRESENT' : 'MISSING');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'staxhaus/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
