import React from 'react';
import { Skeleton } from 'antd';
import styles from './CustomSkeleton.module.css';

const CustomSkeleton = ({ type }) => {
  switch (type) {
    case 'story':
      return (
        <div className={styles.story_skeleton}>
          <Skeleton.Avatar active size={64} shape="circle" />
          <Skeleton.Input active style={{ width: 200, marginTop: 10 }} />
        </div>
      );
    case 'product':
      return (
        <div className={styles.product_skeleton}>
          <Skeleton.Image active style={{ width: 200, height: 200 }} />
          <Skeleton.Input active style={{ width: 150, marginTop: 10 }} />
        </div>
      );
    case 'reviews':
      return (
        <div className={styles.reviews_skeleton}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      );
    case 'faq':
      return (
        <div className={styles.faq_skeleton}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      );
    default:
      return <Skeleton active />;
  }
};

export default CustomSkeleton;
