import { Button, Form, Input, Layout, Select, notification } from "antd"
import React, { useState } from "react"
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks"
import "./../../App.css"
import { Dimensions, Elements, Subelements, Themes } from "../../data/Data"
import formJson from "../../scripts/form.json"

const { Footer, Content } = Layout
const { TextArea } = Input

const contentStyle = {
  flex: 1,
  justifyContent: "center",
  aliginItems: "center",
  padding: "20px",
}
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
}

console.log(formJson, "formJson")

const { Option } = Select

function SiswaPage() {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const methods = useGoogleForm({ form: formJson })

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [selectedDimension, setSelectedDimension] = useState(null)
  console.log(selectedDimension, "selectedDimension")
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedSubelement, setSelectedSubelement] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)

  const openNotification = (
    placement,
    description = "This is the content of the notification."
  ) => {
    api.success({
      message: `Notifikasi`,
      description,
      placement,
    })
  }

  const onSubmit = async (data) => {
    setLoadingSubmit(true)
    console.log(">>> Here is the data", data)
    console.log(">>> Here are the errors!!!", methods.formState.errors)
    await methods.submitToGoogleForms(data)
    console.log(methods, "methods")
    setTimeout(() => {
      setLoadingSubmit(false)
      openNotification("topRight", "Datamu berhasil di submit!")
      form.resetFields()
    }, 1000)
  }
  const onFinish = (event) => {
    // console.log(event, "event")

    const values = form.getFieldsValue()
    console.log(values, "values")

    const findLabelStringById = (data, id) => {
      const newData = data.find((value) => value.id === id)
      return newData?.label
    }

    let body = {
      1614735276: values.Sekolah,
      55847124: values.Kelompok,
      1688946239: findLabelStringById(Dimensions, values.Dimensi),
      1226875206: findLabelStringById(Elements, values.Elemen),
      661708310: findLabelStringById(Subelements, values.Subelemen),
      1168830625: findLabelStringById(Themes, values.Tema),
      800214939: values.Judul,
    }
    // console.log(body, "body")

    methods.handleSubmit(onSubmit(body))
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  const getDescription = (data = [], selected) => {
    if (selected) {
      return (
        <p className="text-[#6B7280] text-xs mb-4">
          Deskripsi : "{data?.find((d) => d.id === selected)?.description}"
        </p>
      )
    }
  }

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
              name="Sekolah"
              label="Pilih Sekolah"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Pilih Sekolah berikut" allowClear>
                <Option value="Sekolah 1">Sekolah 1</Option>
                <Option value="Sekolah 2">Sekolah 2</Option>
                <Option value="Sekolah 3">Sekolah 3</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="Kelompok"
              label="Nama Kelompok"
              rules={[
                {
                  required: true,
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
                },
              ]}
            >
              <Select
                placeholder="Pilih dimensi berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedDimension(value)
                  form.setFieldsValue({
                    Elemen: "",
                    Subelemen: "",
                  })
                }}
              >
                {Dimensions.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  )
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
                },
              ]}
            >
              <Select
                placeholder="Pilih elemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedElement(value)
                  form.setFieldsValue({
                    Subelemen: "",
                  })
                }}
              >
                {Elements.filter(
                  (element) => element.parent_id === selectedDimension
                ).map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  )
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
                },
              ]}
            >
              <Select
                placeholder="Pilih subelemen berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedSubelement(value)
                }}
              >
                {Subelements.filter(
                  (element) => element.element_id === selectedElement
                ).map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
            {getDescription(Subelements, selectedSubelement)}

            <Form.Item
              name="Tema"
              label="Masukkan Tema"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Pilih tema berdasarkan pilihan yang tersedia"
                allowClear
                onChange={(value) => {
                  setSelectedTheme(value)
                }}
              >
                {Themes.map(({ id, label }, index, array) => {
                  return (
                    <Option key={index.toString()} value={id}>
                      {label}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
            {getDescription(Themes, selectedTheme)}

            <Form.Item
              name="Judul"
              label="Judul/Topik"
              rules={[
                {
                  required: true,
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
  )
}

export default SiswaPage
