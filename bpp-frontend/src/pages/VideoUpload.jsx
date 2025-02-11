import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
  }
`;
const SuccessMessage = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #d4edda;
  border-radius: 4px;
  color: #155724;
`;

const VideoPreview = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;
const VideoLink = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  font-size: 14px;
`;

const CopyButton = styled.button`
  padding: 8px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
// Cloudinary config
const CLOUDINARY_CONFIG = {
  cloudName: 'dbiarx9tr',
  uploadPreset: 'videos',
  apiUrl: 'https://api.cloudinary.com/v1_1/dbiarx9tr/video/upload',
};

// ...existing styled components...
const VideoUpload = () => {
  const MAX_FILE_SIZE = 400000 * 1024; // 400KB in bytes

  const formatFileSize = (bytes) => {
    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + 'MB';
    }
    return (bytes / 1024).toFixed(2) + 'KB';
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `El video excede el límite de 400MB. Tamaño actual: ${formatFileSize(
            file.size
          )}`
        );
        setVideo(null);
      } else {
        setError('');
        setVideo(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!video) {
      setError('Por favor seleccione un video');
      setLoading(false);
      return;
    }

    if (video.size > MAX_FILE_SIZE) {
      setError(
        `El video excede el límite de 400KB. Tamaño actual: ${formatFileSize(
          video.size
        )}`
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', video);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'videos');

    try {
      const response = await axios.post(CLOUDINARY_CONFIG.apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentage}%`);
        },
      });

      const videoData = {
        title,
        description,
        videoUrl: response.data.secure_url,
        publicId: response.data.public_id,
        createdAt: new Date().toISOString(),
      };

      setUploadedVideo(videoData);

      const savedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
      savedVideos.push(videoData);
      localStorage.setItem('videos', JSON.stringify(savedVideos));

      setTitle('');
      setDescription('');
      setVideo(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir el video. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Subir Video</h1>
      <small style={{ color: '#666', marginBottom: '10px', display: 'block' }}>
        Tamaño máximo permitido: 400KB
      </small>
      <Form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {video && (
          <small style={{ color: '#666' }}>
            Tamaño del archivo: {formatFileSize(video.size)}
          </small>
        )}
        <Input
          type="text"
          placeholder="Título del video"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Descripción del video"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
        <Button
          type="submit"
          disabled={loading || !video || !title || !description}
        >
          {loading ? 'Subiendo...' : 'Subir Video'}
        </Button>
      </Form>

      {uploadedVideo && (
        <VideoPreview>
          <SuccessMessage>Video subido exitosamente</SuccessMessage>
          <video controls width="100%">
            <source src={uploadedVideo.videoUrl} type="video/mp4" />
          </video>
          <LinkContainer>
            <VideoLink value={uploadedVideo.videoUrl} readOnly />
            <CopyButton
              onClick={() => {
                navigator.clipboard.writeText(uploadedVideo.videoUrl);
                alert('Link copiado al portapapeles');
              }}
            >
              Copiar Link
            </CopyButton>
          </LinkContainer>
        </VideoPreview>
      )}
    </Container>
  );
};

export default VideoUpload;
