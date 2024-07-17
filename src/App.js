import { Layout } from "antd"
import React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import "./App.css"

const { Footer } = Layout

function App() {
  const navigate = useNavigate()
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
          className="-ml-4"
          width={200}
          src={require("./assets/img/merdeka.png")}
        />
      </div>

      <main>
        <Outlet />
      </main>

      <Footer
        className={`
          sticky top-[100vh] z-50 
          backdrop-blur-sm 
          bg-white/80
          border-b-[0.5px] border-['#DADADA'] 
          lg:p-8 p-4 
          text-center
          bg-[#4096ff]
          text-white
        `}
      >
        &copy; 2024 Dany Arkham
      </Footer>
    </Layout>
  )
}

export default App
