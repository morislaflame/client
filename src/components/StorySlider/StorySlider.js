import React, { useEffect, useState } from 'react';
import { fetchStories } from '../../http/storyAPI';
import './StorySlider.css';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';

const StorySlider = () => {
  const [stories, setStories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchStories().then(data => setStories(data));
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setModalShow(true);
  };

  const handleClose = () => {
    setModalShow(false);
    setSelectedStory(null);
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
                  {/* <p>{story.title}</p> */}
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Modal show={modalShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStory && selectedStory.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          {selectedStory && (
            <img
              src={`${process.env.REACT_APP_API_URL}${selectedStory.img}`}
              alt={selectedStory.title}
              className="modal-img"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StorySlider;
