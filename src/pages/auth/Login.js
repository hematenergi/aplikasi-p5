import React, { useState } from "react";
import { Form, Input, Button, Card, message, Carousel } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constant/url";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(JSON.stringify(values), "values");

    setLoading(true);
    try {
      // Replace this with your actual login API call
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.data.token);
        message.success("Login successful");
        navigate("/"); // Redirect to home page
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1666184845325-954301a3375f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Indonesian high school students in classroom",
    },
    {
      src: "https://images.unsplash.com/photo-1625111380820-9a371d413cc4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Indonesian students in a school library",
    },
    {
      src: "https://images.unsplash.com/photo-1629129857796-19c079d2280b?q=80&w=1477&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Indonesian school building",
    },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carousel */}
        <div className="hidden md:block col-span-2 p-4">
          <Carousel
            autoplay
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {carouselImages.map((image, index) => (
              <div key={index}>
                <div className="h-96 flex items-center justify-center bg-gray-200">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center p-4">
          <Card
            className="bg-white shadow-lg rounded-lg"
            title="Masuk"
            style={{ width: "100%", height: "100%" }}
          >
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Kata sandi"
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

            <br />
            <p className="text-sm text-center">
              Belum memiliki akun?
              <br />
              <Link className="text-blue-500" to="/auth/register">
                Daftar sekarang
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
