import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Image } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import ChatContent from "../../components/ChatContent/ChatContent";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { cleanUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import chatIcon from "../../assets/realtime_chat_icon.png";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(cleanUser());

    setTimeout(() => {
      toast.success(`Logging out`);
      navigate("/login");
    }, 1000);
  };

  // Demo data
  const personalUsers = ["Alice", "Bob", "Charlie"];
  const groupChats = ["Group 1", "Group 2", "Group 3"];
  const currentUser = "user1";

  // 👉 Menu items chuẩn v5
  const menuItems = [
    {
      key: "personal",
      icon: <UserOutlined />,
      label: "Personal Chat",
      children: personalUsers.map((u) => ({
        key: `personal-${u}`,
        label: u,
        onClick: () => setSelectedChat(u),
      })),
    },
    {
      key: "group",
      icon: <TeamOutlined />,
      label: "Group Chat",
      children: groupChats.map((g) => ({
        key: `group-${g}`,
        label: g,
        onClick: () => setSelectedChat(g),
      })),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#001529",
          color: "#fff",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Image src={chatIcon} style={{ width: 48, height: 48, marginRight: "12px" }} />
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            Realtime Chat App
          </Title>
        </div>
        <div>
          <Text style={{ color: "#fff", marginRight: 15 }}>Xin chào: {user.username}</Text>
          <Button type="primary" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Layout>
        {/* Sider */}
        <Sider width={250} style={{ background: "#fff" }}>
          <Menu mode="inline" defaultOpenKeys={["personal", "group"]} items={menuItems} />
        </Sider>

        {/* Content */}
        <Content style={{ padding: "20px", background: "#f0f2f5" }}>
          {selectedChat ? (
            <ChatContent chatName={selectedChat} currentUser={currentUser} />
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: 50,
                color: "#888",
              }}
            >
              Select a chat to start messaging
            </div>
          )}
        </Content>
      </Layout>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ marginRight: 20 }}>Alice</Text>
        <Text style={{ marginRight: 20 }}>Bob</Text>
        <Text>Charlie</Text>
      </Footer>
    </Layout>
  );
};

export default ChatPage;
