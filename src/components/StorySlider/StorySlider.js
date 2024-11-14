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
  const [currentStory, setCurrentStory] = useState(null); // Новое состояние

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
        link: story.link, // Добавляем свойство link
      }));

      // Добавляем кастомную историю (если нужно)
      // formatted.push({
      //   content: customContent,
      //   duration: 7000, // Длительность кастомной истории
      // });

      setFormattedStories(formatted);
    } catch (error) {
      console.error('Ошибка загрузки историй:', error);
      message.error('Не удалось загрузить истории');
    }
  };

  // Обработчик начала истории
  const handleStoryStart = (story, currentIndex) => {
    setCurrentStory(story);
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
          <div className="close-stories">
            <button
              className="close-stories-button"
              onClick={() => setIsStoriesVisible(false)}
            >
              <AiFillCloseCircle />
            </button>
          </div>

          {/* Оверлей с ссылкой */}
          {/* {currentStory && currentStory.link && ( */}
            <div className="story-link-overlay">
              <a href={currentStory.link} target="_blank" rel="noopener noreferrer">
                Перейти по ссылке
              </a>
            </div>
          {/* )} */}

          <Stories
            stories={formattedStories}
            currentIndex={currentIndex}
            defaultInterval={5000}
            width={`100vw`}
            height={`100vh`}
            onAllStoriesEnd={() => setIsStoriesVisible(false)}
            onStoryStart={handleStoryStart} // Добавили обработчик
          />
        </div>
      )}
    </div>
  );
};

export default StorySlider;
