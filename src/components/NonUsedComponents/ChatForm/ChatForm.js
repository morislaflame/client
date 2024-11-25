// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// // Подключаемся к WebSocket серверу
// const socket = io(process.env.REACT_APP_API_URL, {
//     transports: ['websocket'],  // Явно используем WebSocket
//     reconnection: true,         // Включаем автоматическое переподключение
//     reconnectionAttempts: 5,    // Количество попыток переподключения
//     reconnectionDelay: 1000
// });

// function Chat() {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         // Логируем подключение к WebSocket
//         console.log('Подключение к WebSocket...');

//         socket.on('connect', () => {
//             console.log('WebSocket подключен');
//         });

//         socket.on('disconnect', () => {
//             console.log('WebSocket отключен');
//         });

//         socket.on('connect_error', (error) => {
//             console.error('Ошибка подключения WebSocket:', error);
//         });

//         // Логируем получение сообщений из Telegram через WebSocket
//         const handleTelegramMessage = (msg) => {
//             console.log('Получено сообщение через WebSocket:', msg);
//             setMessages((prevMessages) => [...prevMessages, msg]);
//         };

//         socket.on('telegramMessage', handleTelegramMessage);

//         // Очищаем слушатели при размонтировании компонента
//         return () => {
//             console.log('Отключение WebSocket');
//             socket.off('telegramMessage', handleTelegramMessage);
//         };
//     }, []);

//     const sendMessage = async () => {
//         try {
//             console.log('Отправка сообщения на сервер:', message);

//             const response = await fetch(`${process.env.REACT_APP_API_URL}api/telegram/send`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message }),
//             });

//             console.log('Ответ от сервера:', await response.json());

//             setMessage('');  // Очищаем поле после отправки
//         } catch (error) {
//             console.error('Ошибка при отправке сообщения:', error);
//         }
//     };

//     return (
//         <div>
//             <div>
//                 <h2>Chat</h2>
//                 <ul>
//                     {messages.map((msg, index) => (
//                         <li key={index}>
//                             <strong>{msg.chatId}:</strong> {msg.text}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <div>
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Введите сообщение"
//                 />
//                 <button onClick={sendMessage}>Отправить</button>
//             </div>
//         </div>
//     );
// }

// export default Chat;
