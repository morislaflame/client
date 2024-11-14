import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchStories } from '../../http/storyAPI';
import Stories from 'react-insta-stories';
import { Button, message } from 'antd';
import './StorySlider.css';
import { AiFillCloseCircle } from 'react-icons/ai';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = useCallback(async () => {
    try {
      const data = await fetchStories();
      setStories(data);
    } catch (error) {
      console.error('Ошибка загрузки историй:', error);
      // Если используете message из antd
      message.error('Не удалось загрузить истории');
    }
  }, []);

  const formattedStories = useMemo(() => {
    return stories.map((story) => {
      const { video, img, title, link, coverImg } = story;
      return {
        url: video
          ? `${process.env.REACT_APP_API_URL}${video}`
          : `${process.env.REACT_APP_API_URL}${img}`,
        header: {
          heading: title,
          subheading: link || '',
          profileImage: coverImg
            ? `${process.env.REACT_APP_API_URL}${coverImg}`
            : undefined,
        },
        type: video ? 'video' : 'image',
        duration: 5000,
        link,
      };
    });
  }, [stories]);

  const handleStoryStart = useCallback((currentIndex, story) => {
    setCurrentStory(story);
  }, []);

  const handleCircleClick = useCallback((index) => {
    setCurrentIndex(index);
    setIsStoriesVisible(true);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (currentStory && currentStory.link) {
      window.open(currentStory.link, '_blank');
    }
  }, [currentStory]);

  return (
    <div className="main-container">
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
            width="100vw"
            height="100vh"
            onAllStoriesEnd={() => setIsStoriesVisible(false)}
            onStoryStart={handleStoryStart}
          />
        </div>
      )}
    </div>
  );
};

export default StorySlider;
