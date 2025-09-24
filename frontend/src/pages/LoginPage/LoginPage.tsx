import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    const { username, password } = values;

    // TODO: call your login API / Apollo mutation
    console.log("Login attempt:", username, password);

    setTimeout(() => {
      setLoading(false);
      message.success(`Welcome ${username}`);
      navigate("/chat"); // redirect sau khi login thành công
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: 350,
          padding: 30,
          background: "#fff",
          borderRadius: 8,
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
