import React from 'react';
import BackButtons from '../../UI/BackButton/Backbuttons';
import styles from './TopicBack.module.css';

const TopicBack = ({ title }) => {
 return (
   <div className={styles.topic_back}>
     <BackButtons />
     <h2>{title}</h2>
   </div>
 );
};

export default TopicBack;