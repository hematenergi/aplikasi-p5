import { Button, Form, Input, Layout, Select, notification, Typography, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import formJson from "../../scripts/formAsesmenKelompok.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";
import { handleApiError } from "../../utils/customHooks";

const { Content } = Layout;
const { Title } = Typography;

const contentStyle = {
  flex: 1,
  justifyContent: "center",
  aliginItems: "center",
  padding: "20px",
};

console.log(formJson, "formJson");

const { Option } = Select;

function AsesmenKelompokPage() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const methods = useGoogleForm({ form: formJson });

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const openNotification = (
    placement,
    description = "This is the content of the notification.",
  ) => {
    api.success({
      message: `Notifikasi`,
      description,
      placement,
    });
  };

  const onSubmit = async (data, dataDb) => {
    setLoadingSubmit(true);
    console.log(">>> Here is the data", data);
    console.log(">>> Here are the errors!!!", methods.formState.errors);
    await methods.submitToGoogleForms(data);
    console.log(methods, "methods");

    try {
      const response = await fetch(`${baseUrl}/asesmen-kelompok`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataDb),
      });
      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          openNotification("topRight", "Datamu berhasil di submit!");
          form.resetFields();
        }, 1000);
      } else {
        const { message: msg, errors } = handleApiError(data);
        Object.keys(errors).forEach((field) => {
          form.setFields([
            {
              name: field,
              errors: errors[field],
            },
          ]);
        });

        // Display general error message
        message.error(msg || "Register failed. Please try again.");
      }

      // setTimeout(() => {
      //   setLoadingSubmit(false);
      //   openNotification("topRight", "Datamu berhasil di submit!");
      //   form.resetFields();
      // }, 1000);
    } catch (error) {}
    setLoadingSubmit(false);
  };
  const onFinish = (event) => {
    // console.log(event, "event")

    const values = form.getFieldsValue();
    console.log(values, "values");

    let body = {
      603839408: values.sekolah_id,
      1868919359: values.nama_kelompok,
      513432574: values.nilai_project_1,
      975129844: values.nilai_project_2,
      818293731: values.nilai_project_3,
    };

    let bodyDb = {
      sekolah_id: values.sekolah_id,
      nama_kelompok: values.nama_kelompok,
      nilai_project_1: values.nilai_project_1,
      nilai_project_2: values.nilai_project_2,
      nilai_project_3: values.nilai_project_3,
      nilai_akhir: 0,
      kriteria: 0,
    };
    // console.log(body, "body")

    methods.handleSubmit(onSubmit(body, bodyDb));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [loading, setLoading] = useState(false);
  const [dataKelompok, setDataKelompok] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/kelompok?school_id=${localStorage.getItem("school_id")}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataKelompok(data.data); // Assuming the data is an array of objects
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content style={contentStyle}>
        <GoogleFormProvider {...methods}>
          <Form
            layout="vertical"
            form={form}
            name="p5-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
              sekolah_id: localStorage.getItem("school_id"),
            }}>
            <Title level={2}>Asesmen Siswa : {localStorage.getItem("school_name")}</Title>
            <Form.Item name="sekolah_id">
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="nama_kelompok"
              label="Nama Kelompok"
              rules={[
                {
                  required: true,
                  message: "Nama kelompok wajib diisi!",
                },
              ]}>
              <Select placeholder="Pilih Kelompok" optionFilterProp="children" loading={loading}>
                {loading ? (
                  <Option key="loading" value="loading" disabled>
                    <Spin />
                  </Option>
                ) : (
                  dataKelompok &&
                  dataKelompok.map((item, index) => (
                    <Option key={index} value={item.nama_kelompok}>
                      {item.nama_kelompok}
                    </Option>
                  ))
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="nilai_project_1"
              label="Nilai Project 1"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 1 wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="nilai_project_2"
              label="Nilai Project 2"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 2 wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="nilai_project_3"
              label="Nilai Project 3"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 3 wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item>
              <Button
                loading={loadingSubmit}
                type="primary"
                htmlType="submit"
                className="w-full lg:w-auto">
                Kirim
              </Button>
            </Form.Item>
          </Form>
        </GoogleFormProvider>
      </Content>
    </Layout>
  );
}

export default AsesmenKelompokPage;
