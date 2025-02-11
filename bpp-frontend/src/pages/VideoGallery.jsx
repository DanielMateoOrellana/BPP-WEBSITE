import { useState, useEffect } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const VideoCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: white;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  padding: 15px;
`;

const VideoTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const VideoDescription = styled.p`
  color: #666;
  margin: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff4444;
`;
const DeleteButton = styled.button`
  padding: 8px 15px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Add delete handler

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleDelete = async (index) => {
    if (!window.confirm('¿Está seguro que desea eliminar este video?')) return;

    try {
      // Get current videos from localStorage
      const currentVideos = JSON.parse(localStorage.getItem('videos') || '[]');
      // Remove video at specified index
      const updatedVideos = currentVideos.filter((_, i) => i !== index);
      // Update localStorage
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      // Update state
      setVideos(updatedVideos);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el video');
    }
  };

  useEffect(() => {
    const loadVideos = () => {
      try {
        const savedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
        setVideos(savedVideos);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar los videos');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) return <LoadingMessage>Cargando videos...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!videos.length)
    return <ErrorMessage>No hay videos disponibles</ErrorMessage>;

  return (
    <GalleryContainer>
      {videos.map((video, index) => (
        <VideoCard key={index}>
          <VideoPlayer controls>
            <source src={video.videoUrl} type="video/mp4" />
            Tu navegador no soporta videos
          </VideoPlayer>
          <VideoInfo>
            <VideoTitle>{video.title}</VideoTitle>
            <VideoDescription>{video.description}</VideoDescription>
            <DeleteButton onClick={() => handleDelete(index)}>
              Eliminar Video
            </DeleteButton>
          </VideoInfo>
        </VideoCard>
      ))}
    </GalleryContainer>
  );
};

export default VideoGallery;
