import { Button, Form, Input, Layout, Select, notification, Typography, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import formJson from "../../scripts/formAsesmenSiswa.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";
import { handleApiError } from "../../utils/customHooks";
const { Title } = Typography;

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
      const response = await fetch(`${baseUrl}/asesmen-siswa`, {
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
      setLoadingSubmit(false);
    } catch (error) {}
  };
  const onFinish = (event) => {
    // console.log(event, "event")

    const values = form.getFieldsValue();
    console.log(values, "values");

    let body = {
      1958881053: values.sekolah_id,
      940569363: values.nama_siswa,
      1872189327: values.nama_kelompok,
      1413700900: values.project,
      1028950252: values.aspek_mengamati,
      27098894: values.aspek_menanya,
      1957221483: values.aspek_menalar,
      1015687652: values.aspek_mencoba,
      1196586704: values.aspek_mengkomunikasikan,
    };

    let bodyDb = {
      sekolah_id: values.sekolah_id,
      nama_siswa: values.nama_siswa,
      nama_kelompok: values.nama_kelompok,
      project: values.project,
      aspek_mengamati: values.aspek_mengamati,
      aspek_menanya: values.aspek_menanya,
      aspek_menalar: values.aspek_menalar,
      aspek_mencoba: values.aspek_mencoba,
      aspek_mengkomunikasikan: values.aspek_mengkomunikasikan,
      skor_rata_rata:
        (values.aspek_mengamati +
          values.aspek_menanya +
          values.aspek_menalar +
          values.aspek_mencoba +
          values.aspek_mengkomunikasikan) /
        5,
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

  const [project, setproject] = useState([]);
  const handleKelompokChange = (value) => {
    let selectedKelompok = dataKelompok.find((item) => item.nama_kelompok === value);

    const projects = [
      {
        judul: selectedKelompok.judul_project_1,
        tema: "Project 1 : " + selectedKelompok.tema_project_1,
      },
      {
        judul: selectedKelompok.judul_project_2,
        tema: "Project 2 : " + selectedKelompok.tema_project_2,
      },
      {
        judul: selectedKelompok.judul_project_3,
        tema: "Project 3 : " + selectedKelompok.tema_project_3,
      },
    ];

    setproject(projects);
    // get form.item Kelompok
  };

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
              <Select
                placeholder="Pilih Kelompok"
                optionFilterProp="children"
                loading={loading}
                onChange={handleKelompokChange}>
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
              name="project"
              label="Pilih Project"
              rules={[
                {
                  required: true,
                  message: "Pilih Project wajib diisi!",
                },
              ]}>
              <Select placeholder="Select a project">
                {project.map((project, index) => (
                  <Option
                    key={index}
                    value={`${project.tema}<>${project.judul}`}
                    label={`${project.tema} - ${project.judul}`}>
                    {`${project.tema} - ${project.judul}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="nama_siswa"
              label="Nama Siswa"
              rules={[
                {
                  required: true,
                  message: "Nama Siswa wajib diisi!",
                },
              ]}>
              <Input placeholder="Masukkan nama Siswa" />
            </Form.Item>

            <Form.Item
              name="aspek_mengamati"
              label="Aspek Mengamati"
              rules={[
                {
                  required: true,
                  message: "Aspek Mengamati wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="aspek_menanya"
              label="Aspek Menanya"
              rules={[
                {
                  required: true,
                  message: "Aspek Menanya wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="aspek_menalar"
              label="Aspek Menalar/Mengasosiasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Menalar/Mengasosiasi wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="aspek_mencoba"
              label="Aspek Mencoba/Simulasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Mencoba/Simulasi wajib diisi!",
                },
              ]}>
              <Input placeholder="Gunakan 2digit angka. contoh: 85" />
            </Form.Item>

            <Form.Item
              name="aspek_mengkomunikasikan"
              label="Aspek Mengkomunikasikan/Presentasi"
              rules={[
                {
                  required: true,
                  message: "Aspek Mengkomunikasikan/Presentasi wajib diisi!",
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

export default AsesmenSiswaPage;
