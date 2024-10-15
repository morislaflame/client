import React, { useEffect, useState, useRef, useContext } from 'react';
import { fetchStories, deleteStory } from '../../http/storyAPI';
import './StorySlider.css';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Context } from '../../index';
import { message, Skeleton, Modal as AntModal } from 'antd';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { HiMiniTrash } from "react-icons/hi2";
import { Button } from 'react-bootstrap';

const { confirm } = AntModal;

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const { user } = useContext(Context);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await fetchStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
      message.error('Error loading stories');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setModalShow(true);
    setProgress(0);
    setIsPaused(false);
    setIsContentLoaded(false);
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

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Вы уверены, что хотите удалить эту историю?',
      content: 'Это действие нельзя будет отменить.',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: () => handleDeleteStory(id),
      onCancel() {
        console.log('Отмена');
      },
    });
  };

  const handleDeleteStory = async (id) => {
    try {
      await deleteStory(id);
      message.success('История удалена');
      setStories((prevStories) => prevStories.filter(story => story.id !== id));
      handleClose(); // Закрываем модальное окно после успешного удаления
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Ошибка при удалении истории: ' + errorMessage);
    }
  };

  const handleImageClick = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleContentLoaded = () => {
    setIsContentLoaded(true);
    startTimer();
  };

  const groupedStories = [];
  for (let i = 0; i < stories.length; i += 4) {
    groupedStories.push(stories.slice(i, i + 4));
  }

  return (
    <div className="story-slider">
      {loading ? (
        <div className="story-skeletons">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="story-card-skeleton">
              <Skeleton.Avatar style={{ width: 'calc(var(--index)* 5.8)', height: 'calc(var(--index)* 5.8)' }} active />
              <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
            </div>
          ))}
        </div>
      ) : (
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
      )}

      <Modal show={modalShow} onHide={handleClose} centered>
        <div className="story-top">
          <ProgressBar now={progress} />
          <Modal.Header data-bs-theme="dark">
            <CloseButton onClick={handleClose} />
            {user.user.role === 'ADMIN' && (
              <Button variant="dark" onClick={() => showDeleteConfirm(selectedStory.id)} className="edit_button">
                <HiMiniTrash />
              </Button>
            )}
          </Modal.Header>
        </div>
        <Modal.Body className="story">
          {selectedStory && (
            <>
              <div className="story-overlay">
                <h3>{selectedStory.title}</h3>
                <a href={selectedStory.link} target="_blank" rel="noopener noreferrer">
                  {selectedStory.link}
                </a>
              </div>
              {selectedStory.video ? (
                <VideoPlayer
                  videoSrc={`${process.env.REACT_APP_API_URL}${selectedStory.video}`}
                  pauseTimer={pauseTimer}
                  resumeTimer={resumeTimer}
                  startTimer={handleContentLoaded}
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}${selectedStory.img}`}
                  alt={selectedStory.title}
                  className="modal-img"
                  loading="lazy"
                  onLoad={handleContentLoaded}
                  onClick={handleImageClick}
                />
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StorySlider;
