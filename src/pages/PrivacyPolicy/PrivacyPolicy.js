import React from 'react';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <TopicBack title='Referral program'/>
      <div className='terms-of-service-content'>
        <div className='terms-of-service-content-eng'>
          <p>If your friend buys a model on our trading platform, you will receive 10% of the deal amount, and your friend will also receive a 10% discount.</p>

          <p>Before buying, you need to send a link to your friend, or your friend must write that he came to you, and we will give him a promo code.</p>
          <p>For sales and purchasing inquiries please contact <a href='https://t.me/EMM_assessor'>@EMM_assessor</a></p>
          <h5>Thank you!</h5>
        </div>
        
      </div>
    </div>
  );
};

export default PrivacyPolicy;
