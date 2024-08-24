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
import formJson from "../../scripts/formAsesmenSiswa.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";
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
      const response = await fetch(`${baseUrl}/asesmen-siswa`, {
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
      1958881053: values.school_id,
      940569363: values.Siswa,
      1872189327: values.Kelompok,
      1413700900: values.Project,
      1028950252: values.Mengamati,
      27098894: values.Menanya,
      1957221483: values.Menalar,
      1015687652: values.Mencoba,
      1196586704: values.Komunikasi,
    };

    let bodyDb = {
      sekolah_id: values.school_id,
      nama_siswa: values.Siswa,
      nama_kelompok: values.Kelompok,
      project: values.Project,
      aspek_mengamati: values.Mengamati,
      aspek_menanya: values.Menanya,
      aspek_menalar: values.Menalar,
      aspek_mencoba: values.Mencoba,
      aspek_mengkomunikasikan: values.Komunikasi,
      skor_rata_rata:
        (values.Mengamati +
          values.Menanya +
          values.Menalar +
          values.Mencoba +
          values.Komunikasi) /
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

  const [project, setproject] = useState([]);
  const handleKelompokChange = (value) => {
    let selectedKelompok = dataKelompok.find(
      (item) => item.nama_kelompok === value
    );

    const projects = [
      {
        judul: selectedKelompok.judul_project_1,
        tema: "Project 1 : " + selectedKelompok.tema_project_1,
      },
      {
        judul: selectedKelompok.judul_project_2,
        tema: "Project 1 : " + selectedKelompok.tema_project_2,
      },
      {
        judul: selectedKelompok.judul_project_3,
        tema: "Project 1 : " + selectedKelompok.tema_project_3,
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
                onChange={handleKelompokChange}
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
              name="Project"
              label="Pilih Project"
              rules={[
                {
                  required: true,
                  message: "Pilih Project wajib diisi!",
                },
              ]}
            >
              <Select placeholder="Select a project">
                {project.map((project, index) => (
                  <Option
                    key={index}
                    value={`${project.tema}<>${project.judul}`}
                    label={`${project.tema} - ${project.judul}`}
                  >
                    {`${project.tema} - ${project.judul}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

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
