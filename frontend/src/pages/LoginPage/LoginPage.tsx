import React from "react";
import { Button, Input, Form, Typography, Image } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import chatIcon from "../../assets/realtime_chat_icon.png";
import { useLogin } from "../../graphql/hooks/user";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const { username, password } = values;

      const response = await login(username, password);
      dispatch(
        setUser({
          username: response?.user.username as string,
          token: response?.token as string,
          id: response?.user.id as string,
        })
      );
      setTimeout(() => {
        toast.success(`Welcome ${username}`);
        navigate("/chat");
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Image src={chatIcon} preview={false} style={{ height: 64, width: 64, marginLeft: 8 }} />
        <Title>Realtime Chat App</Title>
      </div>
      <div
        style={{
          width: 350,
          padding: 30,
          background: "#fff",
          borderRadius: 8,
          paddingTop: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
          Login
        </Title>
        <Form name="login_form" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 10 }}>
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Link tới Register */}
        <div style={{ textAlign: "center", marginTop: 15 }}>
          <Text>
            Don't have an account? <Link to="/register">Register</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
