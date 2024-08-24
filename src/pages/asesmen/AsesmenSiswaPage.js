import { Button, Form, Input, Layout, Select, notification, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import formJson from "../../scripts/formAsesmenSiswa.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";

const { Content } = Layout;

const contentStyle = {
  flex: 1,
  justifyContent: "center",
  aliginItems: "center",
  padding: "20px",
};

console.log(formJson, "formJson");

const { Option } = Select;

function AsesmenSiswaPage() {
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

  const onSubmit = async (data) => {
    setLoadingSubmit(true);
    console.log(">>> Here is the data", data);
    console.log(">>> Here are the errors!!!", methods.formState.errors);
    await methods.submitToGoogleForms(data);
    console.log(methods, "methods");
    setTimeout(() => {
      setLoadingSubmit(false);
      openNotification("topRight", "Datamu berhasil di submit!");
      form.resetFields();
    }, 1000);
  };
  const onFinish = (event) => {
    // console.log(event, "event")

    const values = form.getFieldsValue();
    console.log(values, "values");

    let body = {
      1958881053: values.Sekolah,
      940569363: values.Siswa,
      1872189327: values.Kelompok,
      1413700900: values.Project,
      1028950252: values.Mengamati,
      27098894: values.Menanya,
      1957221483: values.Menalar,
      1015687652: values.Mencoba,
      1196586704: values.Komunikasi,
    };
    // console.log(body, "body")

    methods.handleSubmit(onSubmit(body));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataKelompok, setDataKelompok] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/schools/${localStorage.getItem("school_id")}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.data); // Assuming the data is an array of objects
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
          >
            <Form.Item
              name="school_id"
              label="Pilih Sekolah"
              rules={[
                { required: true, message: "Please input your Schools!" },
              ]}
            >
              <Select
                placeholder="Pilih Sekolah"
                optionFilterProp="children"
                loading={loading}
                defaultValue={localStorage.getItem("school_id")}
              >
                {loading ? (
                  <Option key="loading" value="loading" disabled>
                    <Spin />
                  </Option>
                ) : (
                  data && (
                    // data.map((item) => (
                    <Option key={data.id} value={data.id}>
                      {data.name}
                    </Option>
                  )
                  // ))
                )}
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="Sekolah"
              label="Pilih Sekolah"
              rules={[
                {
                  required: true,
                  message: "Pilih sekolah wajib diisi!",
                },
              ]}
            >
              <Select placeholder="Pilih Sekolah berikut" allowClear>
                <Option value="Sekolah 1">Sekolah 1</Option>
                <Option value="Sekolah 2">Sekolah 2</Option>
                <Option value="Sekolah 3">Sekolah 3</Option>
              </Select>
            </Form.Item> */}

            <Form.Item
              name="Siswa"
              label="Nama Siswa"
              rules={[
                {
                  required: true,
                  message: "Nama Siswa wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Masukkan nama Siswa" />
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
              <Input placeholder="Masukkan nama kelompok dengan format sbb. contoh :'Kelas 10 Kelompok 1'" />
            </Form.Item>

            <Form.Item
              name="Project"
              label="Pilih Project"
              rules={[
                {
                  required: true,
                  message: "Pilih Project wajib diisi!",
                },
              ]}
            >
              <Select placeholder="Pilih Project" allowClear>
                {formJson.fields
                  .find((field) => field.label === "Pilih Project")
                  .options.map((option) => (
                    <Option value={option.label}>{option.label}</Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="Mengamati"
              label="Aspek Mengamati"
              rules={[
                {
                  required: true,
                  message: "Aspek Mengamati wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Menanya"
              label="Aspek Menanya"
              rules={[
                {
                  required: true,
                  message: "Aspek Menanya wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Menalar"
              label="Aspek Menalar/Mengasosiasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Menalar/Mengasosiasi wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Mencoba"
              label="Aspek Mencoba/Simulasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Mencoba/Simulasi wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="Komunikasi"
              label="Aspek Mengkomunikasikan/Presentasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Mengkomunikasikan/Presentasi wajib diisi!",
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

export default AsesmenSiswaPage;
