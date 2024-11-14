import React, { useEffect, useState, useRef, useContext } from 'react';
import { fetchStories, deleteStory } from '../../http/storyAPI';
import { Carousel, Modal, Button, Progress, message, Skeleton, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Context } from '../../index';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { HiMiniTrash } from "react-icons/hi2";
import './StorySlider.css';

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
        <Carousel dots={false} arrows={false} autoplay={false}>
          {groupedStories?.map((group, idx) => {
            if (!group?.length || typeof group === 'string') return null;
            return (
              <div key={idx}>
                <div className="story-group">
                  {group?.map((story) => (
                    <div key={story.id} className="story-card">
                      <img
                        src={`${process.env.REACT_APP_API_URL}${story.coverImg}`}
                        alt=""
                        onClick={() => handleStoryClick(story)}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Carousel>
      )}

      <Modal
        visible={modalShow}
        onCancel={handleClose}
        centered
        footer={null}
        closable={false}
        height={`95vh`}
      >
        <div className="story-top">
          <Progress percent={progress} showInfo={false} strokeColor="#1890ff" />
          <div className="modal-header">
            <Button type="text" icon={<CloseOutlined />} onClick={handleClose} />
            {user.user.role === 'ADMIN' && selectedStory && (
              <Popconfirm
                title="Вы уверены, что хотите удалить эту историю?"
                okText="Да"
                cancelText="Нет"
                onConfirm={() => handleDeleteStory(selectedStory.id)}
              >
                <Button type="text" className="edit_button" icon={<HiMiniTrash />} />
              </Popconfirm>
            )}
          </div>
        </div>
        <div className="story">
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
        </div>
      </Modal>
    </div>
  );
};

export default StorySlider;
