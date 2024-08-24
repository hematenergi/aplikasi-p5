import { Button, Form, Input, Layout, Select, notification, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import { Dimensions, Elements, Subelements, Themes } from "../../data/Data";
import formJson from "../../scripts/formP5.json";
import "./../../App.css";
import { baseUrl } from "../../constant/url";

const { Content } = Layout;
const { TextArea } = Input;

const contentStyle = {
  flex: 1,
  justifyContent: "center",
  aliginItems: "center",
  padding: "20px",
};

const { Option } = Select;

function SiswaPage() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const methods = useGoogleForm({ form: formJson });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState(null);
  console.log(selectedDimension, "selectedDimension");
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedSubelement, setSelectedSubelement] = useState(null);
  const [selectedTheme1, setSelectedTheme1] = useState(null);
  const [selectedTheme2, setSelectedTheme2] = useState(null);
  const [selectedTheme3, setSelectedTheme3] = useState(null);

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
      const response = await fetch(`${baseUrl}/form-siswa`, {
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

    const findLabelStringById = (data, id) => {
      const newData = data.find((value) => value.id === id);
      return newData?.label;
    };

    let body = {
      // 1614735276: values.Sekolah,
      1614735276: values.school_id,
      55847124: values.Kelompok,
      1688946239: findLabelStringById(Dimensions, values.Dimensi),
      1226875206: findLabelStringById(Elements, values.Elemen),
      661708310: findLabelStringById(Subelements, values.Subelemen),
      1168830625: findLabelStringById(Themes, values.Tema1),
      800214939: values.Judul1,
      1468357853: findLabelStringById(Themes, values.Tema2),
      786338565: values.Judul2,
      791492921: findLabelStringById(Themes, values.Tema2),
      299652587: values.Judul2,
    };
    // console.log(body, "body")

    let bodyDb = {
      sekolah_id: values.school_id,
      nama_kelompok: values.Kelompok,
      dimensi: findLabelStringById(Dimensions, values.Dimensi),
      elemen: findLabelStringById(Elements, values.Elemen),
      subelemen: findLabelStringById(Subelements, values.Subelemen),
      tema_project_1: findLabelStringById(Themes, values.Tema1),
      judul_project_1: values.Judul1,
      tema_project_2: findLabelStringById(Themes, values.Tema2),
      judul_project_2: values.Judul2,
      tema_project_3: findLabelStringById(Themes, values.Tema3),
      judul_project_3: values.Judul3,
    };

    methods.handleSubmit(onSubmit(body, bodyDb));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDescription = (data = [], selected) => {
    if (selected) {
      return (
        <p className="text-[#6B7280] text-xs mb-4">
          Deskripsi : "{data?.find((d) => d.id === selected)?.description}"
        </p>
      );
    }
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
                  message: "Pilih Sekolah wajib diisi!",
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
              name="Kelompok"
              label="Nama Kelompok"
              rules={[
                {
                  required: true,
                  message: "Nama Kelompok wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Masukkan nama kelompok dengan format sbb. contoh :'Kelas 10 Kelompok 1'" />
            </Form.Item>

            <Form.Item
              name="Dimensi"
              label="Pilih Dimensi"
              rules={[
                {
                  required: true,
                  message: "Pilih Dimensi wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih dimensi berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedDimension(value);
                  setSelectedElement(null);
                  setSelectedSubelement(null);

                  form.setFieldsValue({
                    Elemen: "",
                    Subelemen: "",
                  });
                }}
              >
                {Dimensions.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Dimensions, selectedDimension)}

            <Form.Item
              name="Elemen"
              label="Pilih Elemen"
              rules={[
                {
                  required: true,
                  message: "Pilih Elemen wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih elemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedElement(value);
                  setSelectedSubelement(null);

                  form.setFieldsValue({
                    Subelemen: "",
                  });
                }}
              >
                {Elements.filter(
                  (element) => element.parent_id === selectedDimension
                ).map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Elements, selectedElement)}

            <Form.Item
              name="Subelemen"
              label="Pilih Subelemen"
              rules={[
                {
                  required: true,
                  message: "Pilih Subelemen wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih subelemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedSubelement(value);
                }}
              >
                {Subelements.filter(
                  (element) => element.element_id === selectedElement
                ).map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Subelements, selectedSubelement)}

            <Form.Item
              name="Tema1"
              label="Masukkan Tema 1"
              rules={[
                {
                  required: true,
                  message: "Masukkan Tema 1 wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme1(value);
                }}
              >
                {Themes.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Themes, selectedTheme1)}

            <Form.Item
              name="Judul1"
              label="Judul/Topik 1"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 1 wajib diisi!",
                },
              ]}
            >
              <TextArea
                rows={2}
                placeholder="Deskripsikan ide lengkapmu berdasarkan pilihan yang kamu pilih sebelumnya..."
              />
            </Form.Item>
            <Form.Item
              name="Tema2"
              label="Masukkan Tema 2"
              rules={[
                {
                  required: true,
                  message: "Masukkan Tema 2 wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme2(value);
                }}
              >
                {Themes.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Themes, selectedTheme2)}

            <Form.Item
              name="Judul2"
              label="Judul/Topik 2"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 2 wajib diisi!",
                },
              ]}
            >
              <TextArea
                rows={2}
                placeholder="Deskripsikan ide lengkapmu berdasarkan pilihan yang kamu pilih sebelumnya..."
              />
            </Form.Item>
            <Form.Item
              name="Tema3"
              label="Masukkan Tema 3"
              rules={[
                {
                  required: true,
                  message: "Masukkan Tema 3 wajib diisi!",
                },
              ]}
            >
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme3(value);
                }}
              >
                {Themes.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {getDescription(Themes, selectedTheme3)}

            <Form.Item
              name="Judul3"
              label="Judul/Topik 3"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 3 wajib diisi!",
                },
              ]}
            >
              <TextArea
                rows={2}
                placeholder="Deskripsikan ide lengkapmu berdasarkan pilihan yang kamu pilih sebelumnya..."
              />
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

export default SiswaPage;
