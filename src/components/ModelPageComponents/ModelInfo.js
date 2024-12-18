import React from 'react';
import styles from './ModelPage.module.css';

const ModelInfo = ({ info }) => {
  return (
    <div className={styles.des_str}>
      <div className={styles.info_str}><span>Age:</span> <div>{info.age}</div></div>
      <div className={styles.info_str}><span>Smartphone:</span> <div>{info.smartphone}</div></div>
      <div className={styles.info_str}><span>% For Her:</span> <div>{info.percent}</div></div>
      <div className={styles.info_str}><span>Time Per Day (hours):</span> <div>{info.time}</div></div>
      <div className={styles.info_str}><span>English Skills (1-10):</span> <div>{info.english}</div></div>
      <div className={styles.info_str}><span>Content:</span> <div>{info.content}</div></div>
      <div className={styles.info_str}><span>When Can She Start:</span> <div>{info.start}</div></div>
      <div className={styles.info_str}><span>Social Media Set Up:</span> <div>{info.socialmedia}</div></div>
      <div className={styles.info_str}><span>Comfortable With TikTok:</span> <div>{info.tiktok}</div></div>
      <div className={styles.info_str}><span>Any Countries Blocked?:</span> <div>{info.cblocked}</div></div>
      <div className={styles.info_str}><span>OF Verified:</span> <div>{info.ofverif}</div></div>
      <div className={styles.info_str}><span>Contract Signed:</span> <div>{info.contract}</div></div>
      <div className={styles.info_str}><span>Does she need account access:</span> <div>{info.girlmsg}</div></div>
    </div>
  );
};

export default ModelInfo;