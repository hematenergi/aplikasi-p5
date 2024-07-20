import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Layout } from "antd"
import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import "./App.css"
import { convertToTitleCase, openInstagram } from "./utils/helper"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  console.log(location, "location")
  const canGoBack = location.pathname !== "/"

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
        {canGoBack && (
          <>
            <Button className="ml-2" onClick={() => navigate(-1)}>
              <ArrowLeftOutlined />
              Kembali
            </Button>

            <div className="text-md font-semibold mr-4">
              Form {convertToTitleCase(location.pathname)}
            </div>
          </>
        )}

        <img
          alt="-"
          className={canGoBack ? "-ml-4 hidden md:block " : "-ml-4"}
          width={200}
          src={require("./assets/img/merdeka.png")}
        />
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
          &copy; 2024 Dany Arkham
        </button>
      </footer>
    </Layout>
  )
}

export default App
