import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface ChatProps {
  socket: Socket;
}

export const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages(prev => [...prev.slice(-49), msg]);
    });
    return () => { socket.off('chatMessage'); };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('sendChat', input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className="chat-line">
            <span className="chat-sender">[{m.sender}]:</span> {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Chat..."
          className="chat-input"
        />
      </form>
    </div>
  );
};
