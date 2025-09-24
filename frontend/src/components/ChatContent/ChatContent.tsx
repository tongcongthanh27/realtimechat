import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Typography, Divider } from "antd";

const { Text } = Typography;

interface Message {
  id: number;
  content: string;
  sender: string;
}

interface ChatContentProps {
  chatName: string;
  currentUser: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ chatName, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hello!", sender: "Alice" },
    { id: 2, content: "Hi! How are you?", sender: currentUser },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: currentUser,
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  // Scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
        }}
      >
        <Text strong>{chatName}</Text>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === currentUser ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: 16,
                backgroundColor: msg.sender === currentUser ? "#1890ff" : "#f0f0f0",
                color: msg.sender === currentUser ? "#fff" : "#000",
              }}
            >
              <Text>{msg.content}</Text>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <Divider style={{ margin: 0 }} />
      <div style={{ display: "flex", padding: 10 }}>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button type="primary" style={{ marginLeft: 10 }} onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatContent;
