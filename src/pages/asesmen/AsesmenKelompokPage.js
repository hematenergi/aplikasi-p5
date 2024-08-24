import {
  Button,
  Form,
  Input,
  Layout,
  Select,
  notification,
  Typography,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import formJson from "../../scripts/formAsesmenKelompok.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";

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
    description = "This is the content of the notification."
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataDb),
      });

      setTimeout(() => {
        setLoadingSubmit(false);
        openNotification("topRight", "Datamu berhasil di submit!");
        form.resetFields();
      }, 1000);
    } catch (error) {}
  };
  const onFinish = (event) => {
    // console.log(event, "event")

    const values = form.getFieldsValue();
    console.log(values, "values");

    let body = {
      603839408: values.Sekolah,
      1868919359: values.Kelompok,
      513432574: values.Nilai1,
      975129844: values.Nilai2,
      818293731: values.Nilai3,
    };

    let bodyDb = {
      sekolah_id: values.school_id,
      nama_kelompok: values.Kelompok,
      nilai_project_1: values.Nilai1,
      nilai_project_2: values.Nilai2,
      nilai_project_3: values.Nilai3,
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
    fetch(
      `${baseUrl}/kelompok?school_id=${localStorage.getItem("school_id")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
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
              school_id: localStorage.getItem("school_id"),
            }}
          >
            <Title level={2}>
              Asesmen Siswa : {localStorage.getItem("school_name")}
            </Title>
            <Form.Item name="school_id">
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="Kelompok"
              label="Nama Kelompok"
              rules={[
                {
                  required: true,
                  message: "Nama kelompok wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih Kelompok"
                optionFilterProp="children"
                loading={loading}
              >
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
              name="Nilai1"
              label="Nilai Project 1"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 1 wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Nilai2"
              label="Nilai Project 2"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 2 wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Nilai3"
              label="Nilai Project 3"
              rules={[
                {
                  required: true,
                  message: "Nilai Project 3 wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item>
              <Button
                loading={loadingSubmit}
                type="primary"
                htmlType="submit"
                className="w-full lg:w-auto"
              >
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
