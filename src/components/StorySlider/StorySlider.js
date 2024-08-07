import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { fetchStories } from '../http/storyAPI';
import './StorySlider.css';

const StorySlider = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories().then(data => setStories(data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  return (
    <div className="story-slider">
      <Slider {...settings}>
        {stories.map(story => (
          <div key={story.id} className="story-card">
            <img src={`${process.env.REACT_APP_API_URL}${story.img}`} alt={story.title} />
            <p>{story.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default StorySlider;