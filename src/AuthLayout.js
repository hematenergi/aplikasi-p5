import {
  ArrowLeftOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, Layout, Menu } from "antd"
import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import "./App.css"
import { convertToTitleCase, openInstagram } from "./utils/helper"

function AuthLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  console.log(location, "location")
  const canGoBack = location.pathname !== "/"

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked")
    // For example: clear local storage, redirect to login page, etc.
    localStorage.removeItem("token")
    navigate("/auth/login")
  }

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout className="h-screen">
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
          className={canGoBack ? "hidden md:block" : ""}
          width={200}
          src={require("./assets/img/merdeka.png")}
        />

        <div className="text-md font-semibold mr-4">Aplikasi Kegiatan P5</div>
      </div>

      <main>
        <Outlet />
      </main>

      <footer
        className={`
          sticky top-[100vh] z-50 
          backdrop-blur-sm 
          border-b-[0.5px] border-['#DADADA'] 
          lg:p-8 p-4 
          text-center
          bg-footerColor
          text-white
        `}
      >
        <button onClick={() => openInstagram("hemat_energi")}>
          &copy; {new Date().getFullYear()} Sama Cipta Teknologi
        </button>
      </footer>
    </Layout>
  )
}

export default AuthLayout
