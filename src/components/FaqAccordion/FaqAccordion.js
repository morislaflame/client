import React from 'react';
import { Accordion, Card, Image } from 'react-bootstrap';
import './FaqAccordion.css';

const FaqAccordion = () => {
  const faqItems = [
    {
      id: 1,
      question: 'Как создать аккаунт?',
      answer: 'Для создания аккаунта, нажмите на кнопку "Регистрация" в верхнем правом углу страницы и заполните необходимые данные.',
      imageUrl: '../../../../server/static/backtwo.jpg', // Путь к изображению
    },
    {
      id: 2,
      question: 'Как сделать заказ?',
      answer: 'Чтобы сделать заказ, выберите интересующий вас товар, добавьте его в корзину и оформите заказ.',
      imageUrl: '../../../../../server/static/back.jpg',
    },
    // Добавьте больше вопросов и ответов по необходимости
  ];

  return (
    <Accordion defaultActiveKey="0">
      {faqItems.map(item => (
        <Accordion.Item eventKey={item.id.toString()} key={item.id}>
          <Accordion.Header>
            <div className="d-flex align-items-center">
              {/* <Image src={item.imageUrl} roundedCircle className="mr-3" /> */}
              <span>{item.question}</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {item.answer}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default FaqAccordion;
