import express from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /upload/profile-picture:
 *   post:
 *     summary: Upload profile picture to Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successfully
 */
router.post('/profile-picture', protect, upload.single('profile'), uploadProfilePicture);

export default router;
