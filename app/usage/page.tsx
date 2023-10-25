// /app/usage/pages.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { updateTotalNumber } from '@/app/updateTotalNumberAction';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, inputValue]);
      setInputValue('');

      // Update total_number in Supabase
      const newMessagesLength = messages.length + 1;
      //updateTotalNumber(newMessagesLength);
      updateTotalNumber(1);
    }
  };

  return (
    <div>
      <div className="chatbox">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>

      <div className="input-section">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div>
        Total messages: {messages.length}
      </div>
    </div>
  );
}

export default ChatBox;
