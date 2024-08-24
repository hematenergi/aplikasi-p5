import React, { useState } from "react"
import { Form, Input, Button, Card, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../../constant/url"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    console.log(JSON.stringify(values), "values")

    setLoading(true)
    try {
      // Replace this with your actual login API call
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        message.success("Login successful")
        navigate("/") // Redirect to home page
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      message.error("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <Card title="Login" style={{ width: 300 }}>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
