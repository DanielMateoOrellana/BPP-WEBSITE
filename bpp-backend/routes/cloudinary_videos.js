const express = require('express');
const multer = require('multer');
const router = express.Router();
const { cloudinary, CLOUDINARY_UPLOAD_PRESET } = require('../cloudinaryConfig1');

// Configure multer for video uploads
const upload = multer({
  limits: {
    fileSize: 400000 * 1024 // 400MB limit
  }
});

// Debug middleware
const debugLogger = (req, res, next) => {
  console.log('🔄 Request:', {
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
  next();
};

router.use(debugLogger);

// Get all videos
router.get('/videos', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'videos/',
      resource_type: 'video',
      max_results: 100
    });
    res.json(result.resources);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al cargar los videos' });
  }
});

// Upload video endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Log request details
      console.log('📦 Upload Request:', {
        files: req.file ? {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        } : 'No file',
        body: req.body,
        timestamp: new Date().toISOString()
      });
  
      if (!req.file) {
        console.error('❌ Error: No file provided');
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }
  
      // Log file details before upload
      console.log('📝 File details:', {
        size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: req.file.mimetype
      });
  
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        resource_type: 'video',
        folder: 'videos',
        upload_preset: CLOUDINARY_UPLOAD_PRESET
      });
  
      // Log successful upload
      console.log('✅ Upload successful:', {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes
      });
  
      res.json({
        secure_url: result.secure_url,
        public_id: result.public_id
      });
  
    } catch (error) {
      // Detailed error logging
      console.error('❌ Upload Error:', {
        message: error.message,
        stack: error.stack,
        details: error.response?.data || 'No additional details',
        timestamp: new Date().toISOString()
      });
  
      res.status(500).json({ 
        error: 'Error al subir el video',
        details: error.message
      });
    }
  });
  
router.delete('/videos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(id, { resource_type: 'video' });
      
      // Delete from database (assuming MongoDB)
      await Video.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Video eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Error al eliminar el video' });
    }
  });
module.exports = router;