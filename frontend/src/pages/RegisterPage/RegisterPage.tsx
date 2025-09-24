import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string; confirm: string }) => {
    const { username, password, confirm } = values;

    if (password !== confirm) {
      message.error("Password and confirm password do not match!");
      return;
    }

    setLoading(true);

    // TODO: call your register API / Apollo mutation
    console.log("Register attempt:", username, password);

    setTimeout(() => {
      setLoading(false);
      message.success(`Account created for ${username}`);
      navigate("/login"); // redirect về LoginPage
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 400,
          padding: 30,
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
