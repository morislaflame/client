import React, { useEffect, useRef, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ videoSrc, pauseTimer, resumeTimer }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Обработчик клика по видео для паузы/возобновления
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        resumeTimer();
      } else {
        videoRef.current.pause();
        pauseTimer();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className={styles.video_player}>
      {isLoading && (
        <div className="video-loading-indicator">
          <Spinner animation="border" variant="light" />
          <div className="loading-text">Загрузка видео...</div>
        </div>
      )}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        className={styles.video}
        preload="metadata"
        onClick={handleVideoClick}
      />
    </div>
  );
};

export default VideoPlayer;
