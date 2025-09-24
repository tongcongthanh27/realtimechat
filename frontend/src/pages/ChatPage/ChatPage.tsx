import React, { useState } from "react";
import { Layout, Menu, Typography, Button } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import ChatContent from "../../components/ChatContent/ChatContent";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  // Demo data
  const personalUsers = ["Alice", "Bob", "Charlie"];
  const groupChats = ["Group 1", "Group 2", "Group 3"];
  const currentUser = "user1";

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
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Realtime Chat App
        </Title>
        <div>
          <Text style={{ color: "#fff", marginRight: 15 }}>Account: {currentUser}</Text>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Layout>
        {/* Sider */}
        <Sider width={250} style={{ background: "#fff" }}>
          <Menu mode="inline" defaultOpenKeys={["personal", "group"]}>
            {/* Personal Chat */}
            <Menu.SubMenu key="personal" icon={<UserOutlined />} title="Personal Chat">
              {personalUsers.map((user) => (
                <Menu.Item key={`personal-${user}`} onClick={() => setSelectedChat(user)}>
                  {user}
                </Menu.Item>
              ))}
            </Menu.SubMenu>

            {/* Group Chat */}
            <Menu.SubMenu key="group" icon={<TeamOutlined />} title="Group Chat">
              {groupChats.map((group) => (
                <Menu.Item key={`group-${group}`} onClick={() => setSelectedChat(group)}>
                  {group}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          </Menu>
        </Sider>

        {/* Content */}
        <Content style={{ padding: "20px", background: "#f0f2f5" }}>
          {selectedChat ? (
            <ChatContent chatName={selectedChat} currentUser={currentUser} />
          ) : (
            <div style={{ textAlign: "center", paddingTop: 50, color: "#888" }}>Select a chat to start messaging</div>
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
