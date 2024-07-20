import { Button, Form, Input, Layout, Select, notification } from "antd"
import React, { useState } from "react"
import { GoogleFormProvider, useGoogleForm } from "react-google-forms-hooks"
import formJson from "../../scripts/formAsesmenKelompok.json"
import "./../../App.css"

const { Content } = Layout

const contentStyle = {
  flex: 1,
  justifyContent: "center",
  aliginItems: "center",
  padding: "20px",
}

console.log(formJson, "formJson")

const { Option } = Select

function AsesmenKelompokPage() {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const methods = useGoogleForm({ form: formJson })

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

    let body = {
      603839408: values.Sekolah,
      1868919359: values.Kelompok,
      513432574: values.Nilai1,
      975129844: values.Nilai2,
      818293731: values.Nilai3,
    }
    // console.log(body, "body")

    methods.handleSubmit(onSubmit(body))
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  const getDescription = (data = [], selected) => {
    console.log("selected", selected)
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
                  message: "Pilih sekolah wajib diisi!",
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
                  message: "Nama kelompok wajib diisi!",
                },
              ]}
            >
              <Input placeholder="Masukkan nama kelompok dengan format sbb. contoh :'Kelas 10 Kelompok 1'" />
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
  )
}

export default AsesmenKelompokPage
