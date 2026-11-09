import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import User from '../models/User.js';


// Configuration-ka Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fadlan soo upload-garee sawir' });
    }

    // Habka loogu raro sawirka 
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profile_pictures' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    // Ku keydi URL-ka sawirka profile-ka isticmaalaha ee hadda soo galay (logged-in user)
    await User.findByIdAndUpdate(req.user._id, { profilePicture: result.secure_url });

    res.status(200).json({
      success: true,
      message: 'Sawirka profile-ka waa la geliyay',
      url: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
