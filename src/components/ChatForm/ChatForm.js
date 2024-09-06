import React, { useState } from 'react';

function ChatForm() {
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}api/telegram/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            setMessage(''); // Очистить поле после отправки
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение"
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    );
}

export default ChatForm;
