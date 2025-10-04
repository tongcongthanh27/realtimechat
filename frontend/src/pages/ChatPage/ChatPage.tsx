import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography, Button, Image, Modal, Input, Checkbox, Space, Badge } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import ChatContent from "../../components/ChatContent/ChatContent";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { cleanUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import chatIcon from "../../assets/realtime_chat_icon.png";
import { useGetUserList } from "../../graphql/hooks/user";
import { type User } from "../../graphql/types/user";
import { type Room } from "../../graphql/types/room";
import { useCreateRoom, useGetRoomList } from "../../graphql/hooks/room";
import { useMessageAdded } from "../../graphql/hooks/message";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<User | Room>();

  const [userList, setUserList] = useState<User[]>([]);
  const [roomList, setRoomList] = useState<Room[]>([]);

  const user = useSelector((state: RootState) => state.user);
  const [currentUser] = useState<User>({
    id: user.id as string,
    username: user.username as string,
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [needRefresh, setNeedRefresh] = useState<boolean>(true);

  const onLogout = () => {
    dispatch(cleanUser());
    setTimeout(() => {
      toast.success(`Logging out`);
      navigate("/login");
    }, 1000);
  };

  const { getUserList, data: dataUser } = useGetUserList();
  const { getRoomList, data: dataRoom } = useGetRoomList(user.id as string);

  useEffect(() => {
    getUserList();
    getRoomList();
  }, []);
  useEffect(() => {
    getUserList();
    getRoomList();
  }, [needRefresh]);
  useEffect(() => {
    if (dataUser) {
      const newData = dataUser.filter((item) => item.id !== user.id);
      setUserList(newData);
    }
  }, [dataUser]);
  useEffect(() => {
    if (dataRoom) setRoomList(dataRoom);
  }, [dataRoom]);

  const [hasNewMessageUser, setHasNewMessageUser] = useState<string[]>([]);
  const { data: dataNewMessage } = useMessageAdded(currentUser.id);
  useEffect(() => {
    console.log(dataNewMessage);
    if (dataNewMessage && !hasNewMessageUser.includes(dataNewMessage.sender.id))
      if (dataNewMessage.receiverRoom === null) {
        console.log(1);
        if (dataNewMessage.sender.id !== selectedChat?.id) {
          setHasNewMessageUser((prev) => {
            return [...prev, dataNewMessage.sender.id];
          });
        }
      } else {
        console.log(2);
        if (dataNewMessage.receiverRoom.id !== selectedChat?.id) {
          setHasNewMessageUser((prev) => {
            return [...prev, dataNewMessage.receiverRoom.id];
          });
        }
      }
  }, [dataNewMessage]);

  // Menu items chuẩn v5
  const menuItems = [
    {
      key: "personal",
      icon: <UserOutlined />,
      label: "Personal Chat",
      children: userList.map((u) => ({
        key: `personal-${u.id}`,
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasNewMessageUser.includes(u.id) ? (
              <Badge dot offset={[10, 5]}>
                <span>{u.username}</span>
              </Badge>
            ) : (
              <span>{u.username}</span>
            )}
          </div>
        ),
        onClick: () => {
          setHasNewMessageUser((prev) => prev.filter((id) => id !== u.id));
          setSelectedChat(u);
        },
      })),
    },
    {
      key: "room",
      icon: <TeamOutlined />,
      label: "Room Chat",
      children: roomList.map((g) => ({
        key: `room-${g.id}`,
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasNewMessageUser.includes(g.id) ? (
              <Badge dot offset={[10, 5]}>
                <span>{g.name}</span>
              </Badge>
            ) : (
              <span>{g.name}</span>
            )}
          </div>
        ),
        onClick: () => {
          setHasNewMessageUser((prev) => prev.filter((id) => id !== g.id));
          setSelectedChat(g);
        },
      })),
    },
  ];

  // ---- HANDLE MODAL ----
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRoomName("");
    setSelectedUsers([]);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const { createRoom } = useCreateRoom();
  const handleCreateRoom = async () => {
    if (!newRoomName) {
      toast.error("Vui lòng nhập tên nhóm");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 thành viên");
      return;
    }
    try {
      const memberIds: string[] = [...selectedUsers, user.id as string];
      await createRoom(newRoomName, memberIds);
      setNeedRefresh((prev) => !prev);
      toast.success(`Nhóm "${newRoomName}" đã được tạo`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
    console.log("Tạo nhóm:", newRoomName, selectedUsers);
    closeModal();
  };

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
          <div
            style={{
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Menu mode="inline" defaultOpenKeys={["personal", "room"]} items={menuItems} />
            <Button style={{ width: "80%" }} onClick={openModal}>
              Tạo phòng
            </Button>
          </div>
        </Sider>

        {/* Content */}
        <Content style={{ padding: "20px", paddingBottom: "4px", background: "#f0f2f5" }}>
          {selectedChat ? (
            <ChatContent chat={selectedChat} currentUser={currentUser} />
          ) : (
            <div style={{ textAlign: "center", paddingTop: 50, color: "#888" }}>Select a chat to start messaging</div>
          )}
        </Content>
      </Layout>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ marginRight: 20 }}>Trần Trọng Vinh</Text>
        <Text style={{ marginRight: 20 }}>Tống Công Thành</Text>
        <Text>Trần Trọng Vinh</Text>
      </Footer>

      {/* ---- MODAL TẠO NHÓM ---- */}
      <Modal title="Tạo nhóm mới" open={isModalOpen} onCancel={closeModal} onOk={handleCreateRoom} okText="Tạo">
        <Input
          placeholder="Tên nhóm"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Text style={{ marginRight: "8px" }}>Chọn thành viên:</Text>
        <Space direction="vertical" style={{ marginTop: 10 }}>
          {userList.map((u) => (
            <Checkbox key={u.id} checked={selectedUsers.includes(u.id)} onChange={() => toggleUser(u.id)}>
              {u.username}
            </Checkbox>
          ))}
        </Space>
      </Modal>
    </Layout>
  );
};

export default ChatPage;
