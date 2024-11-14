import React, { useEffect, useState } from 'react';
import { fetchStories } from '../../http/storyAPI';
import Stories from 'react-insta-stories';
import { message } from 'antd';
import './StorySlider.css';
import { AiFillCloseCircle } from 'react-icons/ai';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [formattedStories, setFormattedStories] = useState([]);
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await fetchStories();
      setStories(data);
      const formatted = data.map((story) => ({
        url: story.video
          ? `${process.env.REACT_APP_API_URL}${story.video}`
          : `${process.env.REACT_APP_API_URL}${story.img}`,
        header: {
          heading: story.title,
          subheading: story.link || '',
          profileImage: story.coverImg
            ? `${process.env.REACT_APP_API_URL}${story.coverImg}`
            : undefined,
        },
        type: story.video ? 'video' : 'image',
        duration: 5000,
      }));

      // Добавляем кастомную историю
      formatted.push({
        content: customContent,
        duration: 7000, // Длительность кастомной истории
      });

      setFormattedStories(formatted);
    } catch (error) {
      console.error('Ошибка загрузки историй:', error);
      message.error('Не удалось загрузить истории');
    }
  };

  const customContent = ({ action, isPaused }) => {
    return (
      <div style={{ background: 'pink', height: '100%', padding: 20 }}>
        <h1 style={{ marginTop: '50%', marginBottom: 0 }}>🌟 Кастомная история 🌟</h1>
        <p>{isPaused ? 'Пауза' : 'Воспроизведение'}</p>
        <button onClick={() => action(isPaused ? 'play' : 'pause')}>
          {isPaused ? 'Продолжить' : 'Пауза'}
        </button>
      </div>
    );
  };

  const handleCircleClick = (index) => {
    setCurrentIndex(index);
    setIsStoriesVisible(true);
  };

  return (
    <div>
      {/* Кружки с историями */}
      <div className="story-circle-container">
        {stories.map((story, index) => (
          <div
            key={index}
            className="story-circle"
            onClick={() => handleCircleClick(index)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${story.coverImg}`}
              alt={story.title}
              className="circle-image"
            />
          </div>
        ))}
      </div>

      {/* Оверлей с историями */}
      {isStoriesVisible && (
        <div className="story-slider-overlay">
          {/* Кнопка закрытия вне заголовка */}
          <button
            className="close-stories-button"
            onClick={() => setIsStoriesVisible(false)}
          >
            <AiFillCloseCircle />
          </button>
          <Stories
            stories={formattedStories}
            currentIndex={currentIndex}
            defaultInterval={5000}
            width={`100vw`}
            height={`100vh`}
            onAllStoriesEnd={() => setIsStoriesVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StorySlider;
