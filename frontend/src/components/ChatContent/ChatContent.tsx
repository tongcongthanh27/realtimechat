import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Typography, Divider } from "antd";
import type { User } from "../../graphql/types/user";
import type { Room } from "../../graphql/types/room";
import type { Message } from "../../graphql/types/message";
import toast from "react-hot-toast";
import { useGetMessageList, useMessageAdded, usePostMessage } from "../../graphql/hooks/message";

const { Text } = Typography;

interface ChatContentProps {
  chat: User | Room;
  currentUser: User;
}

const ChatContent: React.FC<ChatContentProps> = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getMessageList, data: dataMessages } = useGetMessageList();
  useEffect(() => {
    getMessageList(chat.id);
  }, []);
  useEffect(() => {
    getMessageList(chat.id);
  }, [chat.id]);
  useEffect(() => {
    console.log("dataMessages: ", dataMessages);
    if (dataMessages) setMessages(dataMessages);
  }, [dataMessages]);

  const { postMessage } = usePostMessage();
  const handleSend = async () => {
    try {
      if (!newMessage.trim()) return;
      console.log("send");
      const response = await postMessage(newMessage, chat.id);
      if (response) {
        setMessages((prev) => {
          if (!prev.includes(response)) {
            return [...prev, response];
          }
          return [...prev];
        });
        setNewMessage("");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const { data: dataNewMessage } = useMessageAdded(currentUser.id);
  useEffect(() => {
    console.log(dataNewMessage);
    if (
      dataNewMessage &&
      ((dataNewMessage.sender.id === chat.id && !dataNewMessage.receiverRoom) ||
        (dataNewMessage.receiverRoom && dataNewMessage.receiverRoom.id === chat.id))
    )
      setMessages((prev) => {
        if (prev.includes(dataNewMessage)) {
          return [...prev];
        }
        return [...prev, dataNewMessage];
      });
  }, [dataNewMessage]);

  // Scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 160px)",
        overflow: "hidden",
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
        <Text strong>{chat && ("name" in chat ? chat.name : chat.username)}</Text>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <div
          style={{
            // flex: 1,
            // padding: 20,
            // overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.sender.id === currentUser.id ? "flex-end" : "flex-start",
                marginBottom: 10,
                // flexDirection: "column",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  minWidth: "50px",
                }}
              >
                {chat && "name" in chat && msg.sender.id !== currentUser.id && <Text>{msg.sender.username}</Text>}
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 16,
                    backgroundColor: msg.sender.id === currentUser.id ? "#1890ff" : "#f0f0f0",
                    color: msg.sender.id === currentUser.id ? "#000" : "#000",
                    textAlign: msg.sender.id === currentUser.id ? "right" : "left",
                  }}
                >
                  <Text>{msg.content}</Text>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
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
