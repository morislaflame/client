import React, { useEffect, useState } from 'react';
import { fetchStories } from '../../http/storyAPI';
import Stories from 'react-insta-stories';
import { Button, message } from 'antd';
import './StorySlider.css';
import { AiFillCloseCircle } from 'react-icons/ai';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [formattedStories, setFormattedStories] = useState([]);
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);

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
        link: story.link, // Добавляем link на верхний уровень
      }));

      // Добавляем кастомную историю
      formatted.push({
        content: CustomStoryContent,
        duration: 7000,
        link: 'https://example.com', // Ссылка для кастомной истории
      });

      setFormattedStories(formatted);
    } catch (error) {
      console.error('Ошибка загрузки историй:', error);
      message.error('Не удалось загрузить истории');
    }
  };

  const handleStoryStart = (currentIndex, story) => {
    console.log('Current index in handleStoryStart:', currentIndex);
    console.log('Current story in handleStoryStart:', story);
    setCurrentStory(story);
  };

  const handleCircleClick = (index) => {
    setCurrentIndex(index);
    setIsStoriesVisible(true);
  };

  // Функция для обработки клика по кнопке в основном компоненте
  const handleButtonClick = () => {
    if (currentStory && currentStory.link) {
      window.open(currentStory.link, '_blank');
    }
  };

  // Кастомный контент для кастомной истории
  const CustomStoryContent = ({ action, isPaused, story }) => {
    console.log('CustomStoryContent story:', story);

    // Обработчик клика по кнопке внутри кастомной истории
    const handleCustomButtonClick = () => {
      if (story.link) {
        window.open(story.link, '_blank');
      }
    };

    return (
      <div
        style={{
          background: 'pink',
          height: '100%',
          padding: 20,
          position: 'relative',
        }}
      >
        <h1 style={{ marginTop: '50%', marginBottom: 0 }}>🌟 Кастомная история 🌟</h1>
        <p>{isPaused ? 'На паузе' : 'Идёт воспроизведение'}</p>
        <button onClick={() => action(isPaused ? 'play' : 'pause')}>
          {isPaused ? 'Продолжить' : 'Пауза'}
        </button>
        {/* Кнопка для кастомной истории */}
        {story.link && (
          <button
            onClick={handleCustomButtonClick}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Перейти по ссылке
          </button>
        )}
      </div>
    );
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
          {/* Кнопка закрытия */}
          <div className="close-stories">
            <button
              className="close-stories-button"
              onClick={() => setIsStoriesVisible(false)}
            >
              <AiFillCloseCircle />
            </button>
          </div>

          {/* Кнопка для текущей истории */}
          {currentStory && currentStory.link && (
            <Button
              onClick={handleButtonClick}
              className="story-link-button"
              type="primary"
            >
              Learn More
            </Button>
          )}

          {/* Компонент с историями */}
          <Stories
            stories={formattedStories}
            currentIndex={currentIndex}
            defaultInterval={5000}
            width={`100vw`}
            height={`100vh`}
            onAllStoriesEnd={() => setIsStoriesVisible(false)}
            onStoryStart={handleStoryStart}
          />
        </div>
      )}
    </div>
  );
};

export default StorySlider;
