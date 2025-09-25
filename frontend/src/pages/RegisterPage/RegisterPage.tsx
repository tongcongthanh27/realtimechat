import React from "react";
import { Button, Input, Form, Typography, message, Image } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../../graphql/hooks/user";
import chatIcon from "../../assets/realtime_chat_icon.png";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const onFinish = async (values: { username: string; password: string; confirm: string }) => {
    try {
      const { username, password, confirm } = values;
      if (password !== confirm) {
        message.error("Password and confirm password do not match!");
        return;
      }

      console.log("Register attempt:", username, password);
      const response = await register(username, password);
      console.log(response);

      setTimeout(() => {
        message.success(`Account created for ${username}`);
        navigate("/login"); // redirect về LoginPage
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Image src={chatIcon} preview={false} style={{ height: 64, width: 64, marginLeft: 8 }} />
        <Title>Realtime Chat App</Title>
      </div>
      <div
        style={{
          width: "90%",
          maxWidth: 400,
          padding: 30,
          paddingTop: 8,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
          Register
        </Title>
        <Form name="register_form" layout="vertical" onFinish={onFinish} autoComplete="off">
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

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 10 }}>
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Link tới Login */}
        <div style={{ textAlign: "center", marginTop: 15 }}>
          <Text>
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
