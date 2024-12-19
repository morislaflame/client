import React, { useLayoutEffect } from 'react';
import BackButtons from '../../UI/BackButton/Backbuttons';
import styles from './TopicBack.module.css';
import { DownAnimation } from '../../Animations/DownAnimation';

const TopicBack = ({ title }) => {
  useLayoutEffect(() => {
    DownAnimation('#topic_back');
  }, []);
  
 return (
   <div className={styles.topic_back} id='topic_back'>
     <BackButtons />
     <h2>{title}</h2>
   </div>
 );
};

export default TopicBack;