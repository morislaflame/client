import React, { useEffect, useState, useRef, useContext } from 'react';
import { fetchStories, deleteStory } from '../../http/storyAPI';
import './StorySlider.css';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Context } from '../../index';
import { message } from 'antd';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const { user } = useContext(Context);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    fetchStories().then((data) => setStories(data));
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setModalShow(true);
    setProgress(0);
    setIsPaused(false);
    startTimer();
  };

  const handleClose = () => {
    setModalShow(false);
    setSelectedStory(null);
    clearTimer();
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleClose();
          return 0;
        }
        return prev + 100 / (10 * 10);
      });
    }, 100);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (isPaused) {
      startTimer();
      setIsPaused(false);
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleDeleteStory = (id) => {
    deleteStory(id)
      .then(() => {
        message.success('История удалена');
        loadStories();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        message.error('Ошибка при удалении истории: ' + errorMessage);
      });
  };

  const handleImageClick = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const groupedStories = [];
  for (let i = 0; i < stories.length; i += 4) {
    groupedStories.push(stories.slice(i, i + 4));
  }

  return (
    <div className="story-slider">
      <Carousel indicators={false} controls={false} interval={null}>
        {groupedStories.map((group, idx) => (
          <Carousel.Item key={idx}>
            <div className="story-group">
              {group.map((story) => (
                <div key={story.id} className="story-card">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${story.coverImg}`}
                    alt={story.title}
                    onClick={() => handleStoryClick(story)}
                    loading="lazy"
                  />
                  
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Modal show={modalShow} onHide={handleClose} centered>
        <div className="story-top">
          <ProgressBar now={progress} />
          <Modal.Header data-bs-theme="dark">
            <CloseButton onClick={handleClose} />
          </Modal.Header>
        </div>
        <Modal.Body className="story">
          {selectedStory && (
            <>
              {selectedStory.video ? (
                <VideoPlayer
                  videoSrc={`${process.env.REACT_APP_API_URL}${selectedStory.video}`}
                  pauseTimer={pauseTimer}
                  resumeTimer={resumeTimer}
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}${selectedStory.img}`}
                  alt={selectedStory.title}
                  className="modal-img"
                  loading="lazy"
                  onClick={handleImageClick}
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Title>{selectedStory && selectedStory.title}</Modal.Title>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StorySlider;
