import React from "react"
import { Button } from "../../components/Button"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="text-center flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <div className="absolute z-0 bg-image h-screen w-full bg-blend-overlay" />
      <div className="z-10">
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-medium text-white/75">
          <span className="text-footerColor/75">Aplikasi form</span> Kegiatan P5
        </h1>
      </div>
      <div className="text-center margin z-10">
        <br />
        <p className="text-sm text-white/75 md:text-md lg:text-lg">
          Klik tombol dibawah ini untuk melakukan pengisian
        </p>
        <br />
      </div>

      <div className="grid grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-5 z-10">
        <Button label={"Form Siswa"} onClick={() => navigate("siswa")} />
        <Button
          label={"Form Asesmen Siswa"}
          onClick={() => navigate("asesmen-siswa")}
        />
        <Button
          label={"Form Asesmen Kelompok"}
          onClick={() => navigate("asesmen-kelompok")}
        />
      </div>
    </div>
  )
}
