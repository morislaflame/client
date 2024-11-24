import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section social-links">
          <h4>Социальные сети</h4>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="footer-section links">
          <h4>Полезные ссылки</h4>
          <Link to="/terms">Условия сотрудничества</Link>
          <Link to="/privacy">Политика конфиденциальности</Link>
        </div>
        <div className="footer-section warnings">
          <h4>Варнинги</h4>
          <p>Некоторые важные предупреждения и дисклеймеры для пользователей.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
