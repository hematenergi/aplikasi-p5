import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Carousel, Select, Spin } from "antd";
import { UserOutlined, LockOutlined, NumberOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constant/url";
import { handleApiError } from "../../utils/customHooks";

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState("2");
  const [nipRequired, setNipRequired] = useState(false);
  const handleTypeChange = (value) => {
    setType(value);
    setNipRequired(value === "1");
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/schools`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.data.data); // Assuming the data is an array of objects
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const onFinish = async (values) => {
    console.log(JSON.stringify(values), "values");

    setLoading(true);
    try {
      // Replace this with your actual login API call
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        // const data = await response.json();
        // localStorage.setItem("token", data.data.token);
        // localStorage.setItem("school_id", data.data.school_id);
        // localStorage.setItem("school_name", data.data.school_name);
        // localStorage.setItem("type", data.data.type);
        message.success("Register successful");
        navigate("/auth/login"); // Redirect to home page
      } else {
        console.log(data, "response error");
        const { message: msg, errors } = handleApiError(data);

        // Set form errors
        Object.keys(errors).forEach((field) => {
          form.setFields([
            {
              name: field,
              errors: errors[field],
            },
          ]);
        });

        // Display general error message
        message.error(msg || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log(error, "error catch");
    } finally {
      setLoading(false);
    }
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
          <Carousel autoplay className="bg-white rounded-lg shadow-lg overflow-hidden">
            {carouselImages.map((image, index) => (
              <div key={index}>
                <div className="h-96 flex items-center justify-center bg-gray-200">
                  <img src={image.src} alt={image.alt} className="object-cover w-full h-full" />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center p-4">
          <Card
            className="bg-white shadow-lg rounded-lg"
            title="Daftar"
            style={{ width: "100%", height: "100%" }}>
            <Form
              form={form}
              name="normal_register"
              initialValues={{
                type: "2",
              }}
              onFinish={onFinish}>
              <Form.Item
                name="school_id"
                rules={[{ required: true, message: "Please input your Schools!" }]}>
                <Select placeholder="Pilih Sekolah" optionFilterProp="children" loading={loading}>
                  {loading ? (
                    <Option key="loading" value="loading" disabled>
                      <Spin />
                    </Option>
                  ) : (
                    data &&
                    data.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="type"
                rules={[{ required: true, message: "Please input your type!" }]}>
                <Select
                  showSearch
                  placeholder="Daftar Sebagai"
                  defaultValue={type}
                  onChange={handleTypeChange}
                  options={[
                    {
                      value: "2",
                      label: "Siswa",
                    },
                    {
                      value: "1",
                      label: "Guru",
                    },
                  ]}
                />
              </Form.Item>
              {type === "1" && (
                <Form.Item
                  name="nip"
                  rules={[
                    {
                      required: nipRequired,
                      message: "Please input your Nip!",
                    },
                  ]}>
                  <Input prefix={<NumberOutlined />} placeholder="Nip" />
                </Form.Item>
              )}
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please input your Name!" }]}>
                <Input prefix={<UserOutlined />} placeholder="Nama" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please input your Email!" }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}>
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
                  style={{ width: "100%" }}>
                  Register
                </Button>
              </Form.Item>
            </Form>

            <br />
            <p className="text-sm text-center">
              Sudah memiliki akun?
              <br />
              <Link className="text-blue-500" to="/auth/login">
                Login sekarang
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
