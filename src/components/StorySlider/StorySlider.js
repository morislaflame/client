import React, { useEffect, useState, useRef } from 'react';
import { fetchStories } from '../../http/storyAPI';
import './StorySlider.css';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import ProgressBar from 'react-bootstrap/ProgressBar';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchStories().then(data => setStories(data));
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setModalShow(true);
    setProgress(0); // Сброс прогресса
    startTimer();   // Запуск таймера
  };

  const handleClose = () => {
    setModalShow(false);
    setSelectedStory(null);
    clearTimer(); // Остановка таймера при закрытии модального окна
  };

  const startTimer = () => {
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleClose(); // Закрыть окно, когда прогресс достигнет 100%
          return 0;
        }
        return prev + 100 / (5 * 10); // Прогресс на 6 секунд
      });
    }, 100); // Обновление прогресса каждые 0.1 сек
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      clearInterval(timerRef.current); // Остановка таймера
    } else {
      startTimer(); // Возобновление таймера
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const groupedStories = [];
  for (let i = 0; i < stories.length; i += 3) {
    groupedStories.push(stories.slice(i, i + 3));
  }

  return (
    <div className="story-slider">
      <Carousel indicators={false} controls={true} interval={null}>
        {groupedStories.map((group, idx) => (
          <Carousel.Item key={idx}>
            <div className="story-group">
              {group.map((story) => (
                <div key={story.id} className="story-card" onClick={() => handleStoryClick(story)}>
                  <img src={`${process.env.REACT_APP_API_URL}${story.img}`} alt={story.title} />
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Modal show={modalShow} onHide={handleClose} centered>
        <div className='story-top'>
          
          <ProgressBar now={progress} />
          <Modal.Header data-bs-theme="dark">
            <CloseButton onClick={handleClose}/>
          </Modal.Header>
        </div>
        <Modal.Body className='story' onClick={togglePause}> 
          {selectedStory && (
            <img
              src={`${process.env.REACT_APP_API_URL}${selectedStory.img}`}
              alt={selectedStory.title}
              className="modal-img"
            />
          )}
          {/* Прогресс-бар */}
          
        </Modal.Body>
        <Modal.Header>
          <Modal.Title>{selectedStory && selectedStory.title}</Modal.Title>
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default StorySlider;
