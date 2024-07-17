import React from "react"
import { Button } from "../../components/Button"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="text-center flex flex-col items-center justify-center h-[calc(100vh-300px)]">
      <div>
        <h1 className="text-3xl  md:text-6xl lg:text-7xl font-medium">
          <span className="text-mainColor">Aplikasi form</span> Kegiatan P5
        </h1>
      </div>
      <div data-aos="fade-right" className="text-center margin">
        <br />
        <p className="text-sm text-black/75 md:text-md lg:text-lg">
          Klik tombol dibawah ini untuk melakukan pengisian
        </p>
        <br />
      </div>

      <div className="grid grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
        <Button label={"Form Siswa"} onClick={() => navigate("siswa")} />
        <Button
          label={"Form Kelompok"}
          onClick={() => navigate("asesmen-kelompok")}
        />
        <Button label={"Form Asesmen"} onClick={() => navigate("asesmen")} />
      </div>
    </div>
  )
}
