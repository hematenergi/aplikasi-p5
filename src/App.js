import { Button, Form, Input, Layout, Select, notification } from "antd"
import React, { useState } from "react"
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks"
import "./App.css"
import { Dimensions, Elements, Subelements } from "./Data"
import formJson from "./scripts/form.json"

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
console.log(formJson.fields, "formJson")

const { Option } = Select
const Context = React.createContext({
  name: "Default",
})

function App() {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const methods = useGoogleForm({ form })

  const [loadingSubmit, setLoadingSubmit] = useState(false)
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
    console.log(">>> Here is the data", data)
    console.log(">>> Here are the errors!!!", methods.formState.errors)
    await methods.submitToGoogleForms(data)
    setTimeout(() => {
      setLoadingSubmit(false)
      openNotification("topRight", "Datamu berhasil di submit!")
    }, 1000)
  }

  const [selectedDimension, setSelectedDimension] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedSubelement, setSelectedSubelement] = useState(null)
  const onFinish = (event) => {
    event.preventDefault()
    setLoadingSubmit(true)

    const values = form.getFieldsValue()
    console.log(values, "values")

    const findLabelStringById = (data, id) => {
      const newData = data.find((value) => value.id === id)
      return newData.label
    }

    let body = {
      1614735276: values.Sekolah,
      1688946239: findLabelStringById(Dimensions, values.Dimensi),
      1226875206: findLabelStringById(Elements, values.Elemen),
      661708310: findLabelStringById(Subelements, values.Subelemen),
      1168830625: values.Tema,
    }

    methods.handleSubmit(onSubmit(body))
  }
  const onReset = () => {
    form.resetFields()
  }
  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    })
  }
  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <div
        className={`
            sticky top-0 z-50 
            backdrop-blur-sm 
            bg-white/80
            border-b-[0.5px] border-['#DADADA'] 
            lg:p-4 p-2
            flex justify-between items-center
            text-center
            `}
      >
        <img
          alt="-"
          className="-ml-4"
          width={200}
          src={require("./assets/img/merdeka.png")}
        />
        <div className="text-md lg:text-xl font-bold lg:mr-2 mr-3">
          Prototype Aplikasi P5
        </div>
      </div>

      <Content style={contentStyle}>
        <GoogleFormProvider {...methods}>
          <Form
            id={form.field}
            layout="vertical"
            form={form}
            name="p5-form"
            onFinish={onFinish}
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
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              >
                <Option value="Sekolah 1">Sekolah 1</Option>
                <Option value="Sekolah 2">Sekolah 2</Option>
                <Option value="Sekolah 3">Sekolah 3</Option>
              </Select>
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
                placeholder="Select a option and change input text above"
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
                placeholder="Select a option and change input text above"
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
                placeholder="Select a option and change input text above"
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

            <Form.Item
              name="Tema"
              label="Masukkan Tema"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea rows={2} placeholder="Describe your idea..." />
            </Form.Item>

            <Form.Item>
              <Button
                loading={loadingSubmit}
                type="primary"
                htmlType="submit"
                className="w-full lg:w-auto"
                onClick={onFinish}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </GoogleFormProvider>
      </Content>

      <Footer
        className={`
          sticky top-[100vh] z-50 
          backdrop-blur-sm 
          bg-white/80
          border-b-[0.5px] border-['#DADADA'] 
          text-center
          lg:p-8 p-4
        `}
        style={footerStyle}
      >
        2024 copyright
      </Footer>
    </Layout>
  )
}

export default App
