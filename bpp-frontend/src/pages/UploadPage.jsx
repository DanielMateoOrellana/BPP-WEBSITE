import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
  Snackbar,
  Paper,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BackupIcon from '@mui/icons-material/Backup';

const CLOUDINARY_UPLOAD_PRESET = 'images';
const CLOUDINARY_CLOUD_NAME = 'dbiarx9tr';

const UploadPage = ({ theme }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const uploadData = await uploadResponse.json();

      setUploadedUrl(uploadData.secure_url);
      setShowSuccess(true);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Subir Imagen
      </Typography>

      <input
        type="file"
        id="file-input"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
          }
        }}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Box
        component="label"
        htmlFor="file-input"
        sx={{
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          transition: '0.3s',
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <BackupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Arrastra una imagen o haz clic aquí
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PNG, JPG, GIF hasta 10MB
        </Typography>
      </Box>

      {preview && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <CardMedia
            component="img"
            image={preview}
            alt="Preview"
            sx={{
              maxHeight: 200,
              width: 'auto',
              margin: '0 auto',
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
            sx={{ mt: 2 }}
          >
            {loading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </Box>
      )}

      {uploadedUrl && (
        <Box mt={4}>
          <Alert severity="success">Imagen subida exitosamente</Alert>
          <CardMedia
            component="img"
            image={uploadedUrl}
            alt="Uploaded"
            sx={{ maxHeight: 200, width: 'auto', mt: 2, borderRadius: 1 }}
          />
          <Paper
            sx={{
              p: 2,
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {uploadedUrl}
            </Typography>
            <IconButton
              onClick={() => handleCopyUrl(uploadedUrl)}
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message="Imagen subida exitosamente"
      />

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="URL copiada al portapapeles"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default UploadPage;
