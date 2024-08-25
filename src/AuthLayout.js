import { Layout } from "antd";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { openInstagram } from "./utils/helper";

function AuthLayout() {
  const location = useLocation();
  const canGoBack = location.pathname !== "/";

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
      `}>
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
        `}>
        <button onClick={() => openInstagram("hemat_energi")}>
          &copy; {new Date().getFullYear()} Sama Cipta Teknologi
        </button>
      </footer>
    </Layout>
  );
}

export default AuthLayout;
