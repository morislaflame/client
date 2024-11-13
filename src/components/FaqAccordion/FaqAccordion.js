import React from 'react';
import { Collapse } from 'antd';
import './FaqAccordion.css';

const FaqAccordion = () => {
  const faqItems = [
    {
      id: 1,
      question: 'What does the process of buying a model look like?',
      answer: 'After payment in cryptocurrency, we confirm the order and the model is automatically assigned to you (you can track the status of the order and assigned models in your personal cabinet). At the same moment, we create a chat with you and the model in Telegram, where you can discuss all the details and agree on the start date.',

    },
    {
      id: 2,
      question: 'How can I issue a refund?',
      answer: 'If you are not satisfied with the performance of the model, you can make a return within 14 days from the date of order. To do this, go to your personal cabinet, select a model, fill in all the data for the return and indicate the reason. Our managers will check all the data and refund your money to the wallet you specified.',

    },
    {
      id: 3,
      question: 'How can I exchange the model?',
      answer: 'Exchange is an alternative to a refund. You can exchange a model for another if it does not meet your expectations. To do this, go to your personal cabinet, select a model, fill in all the data for the exchange and indicate the reason. Our managers will check all the data and exchange your model for the one specified in the application.',

    },
    {
      id: 4,
      question: 'Do you accept a guarantor?',
      answer: 'To connect a guarantor to the deal, you need to place an order through our Telegram channel. We work with guarantors Cardo, Henri and Laugh',

    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer: 'We only accept payments in cryptocurrency: USDT(TRC-20, ERC-20, BEP-20), BTC, ETH, SOL, USDC(ERC-20, Arbitrium One). The actual addresses for payment you can see when placing an order. If you want to pay in a cryptocurrency not listed in this list, write to the manager in Telegram, the list will be expanded in the future.',

    },
    {
      id: 6,
      question: 'Can I reserve a model?',
      answer: 'Yes, you can reserve a model for 24 hours for $50 if it is not assigned to another user. If you decide not to buy the model, we will leave the deposit. To reserve, write to the manager in Telegram',
    },
  ];

  return (
    <Collapse defaultActiveKey={['1']}>
      {faqItems.map(item => (
        <Collapse.Panel 
          header={
            <div className="acc_item">
              <span>{item.question}</span>
            </div>
          } 
          key={item.id}
        >
          {item.answer}
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default FaqAccordion;
