import React from 'react';
import './PaymentPage.css';
import { QRCodeCanvas } from 'qrcode.react'; // Импортируем QRCodeCanvas
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const totalAmountRub = location.state?.totalAmount || 0;

  // Переводим рубли в доллары. Допустим, курс 1 доллар = 100 рублей.
  const exchangeRate = 100;
  const totalAmountUSD = (totalAmountRub / exchangeRate).toFixed(2);

  return (
    <div className="payment-page">
      <h2>Оплата</h2>
      <div className="payment-details">
        <h3>Сумма к оплате: {totalAmountUSD} USD</h3>
        <div className="qr-code">
          <QRCodeCanvas value={`usdt:${totalAmountUSD}`} size={256} /> {/* Используем QRCodeCanvas */}
        </div>
        <p>Отсканируйте QR-код для оплаты в USDT.</p>
      </div>
    </div>
  );
};

export default PaymentPage;
