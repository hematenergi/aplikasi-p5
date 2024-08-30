import { Button, Form, Input, Layout, Select, Typography, message, notification } from "antd";
import React, { useState } from "react";
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks";
import { baseUrl } from "../../constant/url";
import { Dimensions, Elements, Subelements, Themes } from "../../data/Data";
import formJson from "../../scripts/formP5.json";
import { handleApiError } from "../../utils/customHooks";
import "./../../App.css";

const { Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

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
      const response = await fetch(`${baseUrl}/form-siswa`, {
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
      // setTimeout(() => {
      //   setLoadingSubmit(false);
      //   openNotification("topRight", "Datamu berhasil di submit!");
      //   form.resetFields();
      // }, 1000);
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
      1614735276: values.sekolah_id,
      55847124: values.nama_kelompok,
      1688946239: findLabelStringById(Dimensions, values.dimensi),
      1226875206: findLabelStringById(Elements, values.elemen),
      661708310: findLabelStringById(Subelements, values.subelemen),
      1168830625: findLabelStringById(Themes, values.tema_project_1),
      800214939: values.judul_project_1,
      1468357853: findLabelStringById(Themes, values.tema_project_2),
      786338565: values.judul_project_2,
      791492921: findLabelStringById(Themes, values.tema_project_3),
      299652587: values.judul_project_3,
    };
    // console.log(body, "body")

    let bodyDb = {
      sekolah_id: values.sekolah_id,
      nama_kelompok: values.nama_kelompok,
      dimensi: findLabelStringById(Dimensions, values.dimensi),
      elemen: findLabelStringById(Elements, values.elemen),
      subelemen: findLabelStringById(Subelements, values.subelemen),
      tema_project_1: findLabelStringById(Themes, values.tema_project_1),
      judul_project_1: values.judul_project_1,
      tema_project_2: findLabelStringById(Themes, values.tema_project_2),
      judul_project_2: values.judul_project_2,
      tema_project_3: findLabelStringById(Themes, values.tema_project_3),
      judul_project_3: values.judul_project_3,
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

  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`${baseUrl}/schools/${localStorage.getItem("school_id")}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data.data); // Assuming the data is an array of objects
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // }, []);

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
            <Title level={2}>Form Siswa : {localStorage.getItem("school_name")}</Title>

            <Form.Item name="sekolah_id">
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="nama_kelompok"
              label="Nama Kelompok"
              rules={[
                {
                  required: true,
                  message: "Nama Kelompok wajib diisi!",
                },
              ]}>
              <Input placeholder="Masukkan nama kelompok dengan format sbb. contoh :'Kelas 10 Kelompok 1'" />
            </Form.Item>

            <Form.Item
              name="dimensi"
              label="Pilih Dimensi"
              rules={[
                {
                  required: true,
                  message: "Pilih Dimensi wajib diisi!",
                },
              ]}>
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
                }}>
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
              name="elemen"
              label="Pilih Elemen"
              rules={[
                {
                  required: true,
                  message: "Pilih Elemen wajib diisi!",
                },
              ]}>
              <Select
                placeholder="Pilih elemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedElement(value);
                  setSelectedSubelement(null);

                  form.setFieldsValue({
                    Subelemen: "",
                  });
                }}>
                {Elements.filter((element) => element.parent_id === selectedDimension).map(
                  ({ id, label }, index, array) => {
                    return (
                      <Option key={index.toString()} value={id}>
                        {label}
                      </Option>
                    );
                  },
                )}
              </Select>
            </Form.Item>
            {getDescription(Elements, selectedElement)}

            <Form.Item
              name="subelemen"
              label="Pilih Subelemen"
              rules={[
                {
                  required: true,
                  message: "Pilih Subelemen wajib diisi!",
                },
              ]}>
              <Select
                placeholder="Pilih subelemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedSubelement(value);
                }}>
                {Subelements.filter((element) => element.element_id === selectedElement).map(
                  ({ id, label }, index, array) => {
                    return (
                      <Option key={index.toString()} value={id}>
                        {label}
                      </Option>
                    );
                  },
                )}
              </Select>
            </Form.Item>
            {getDescription(Subelements, selectedSubelement)}

            <Form.Item
              name="tema_project_1"
              label="Masukkan Tema 1"
              rules={[
                {
                  required: true,
                  message: "Tema 1 wajib diisi!",
                },
              ]}>
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme1(value);
                }}>
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
              name="judul_project_1"
              label="Judul/Topik 1"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 1 wajib diisi!",
                },
              ]}>
              <TextArea
                rows={2}
                placeholder="Deskripsikan ide lengkapmu berdasarkan pilihan yang kamu pilih sebelumnya..."
              />
            </Form.Item>
            <Form.Item
              name="tema_project_2"
              label="Masukkan Tema 2"
              rules={[
                {
                  required: true,
                  message: "Tema 2 wajib diisi!",
                },
              ]}>
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme2(value);
                }}>
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
              name="judul_project_2"
              label="Judul/Topik 2"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 2 wajib diisi!",
                },
              ]}>
              <TextArea
                rows={2}
                placeholder="Deskripsikan ide lengkapmu berdasarkan pilihan yang kamu pilih sebelumnya..."
              />
            </Form.Item>
            <Form.Item
              name="tema_project_3"
              label="Masukkan Tema 3"
              rules={[
                {
                  required: true,
                  message: "Tema 3 wajib diisi!",
                },
              ]}>
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme3(value);
                }}>
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
              name="judul_project_3"
              label="Judul/Topik 3"
              rules={[
                {
                  required: true,
                  message: "Judul/Topik 3 wajib diisi!",
                },
              ]}>
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

export default SiswaPage;
