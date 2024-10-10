import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { getRoleName } from "../../utils/helper";

export const Home = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");

  console.log(roleName, "roleName");

  useEffect(() => {
    const role = getRoleName(localStorage.getItem("type"));

    setRoleName(role);

    return () => {};
  }, []);

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

      <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-2 gap-5 z-10">
        {roleName === "student" && (
          <>
            <Button label={"Form Siswa"} onClick={() => navigate("siswa")} />
            {/* <Button
              label={"Download Template Essay"}
              onClick={() => window.open("http://aplikasi-p5.site/Format-Essay-P5.docx", "_blank")}
            /> */}
            <Link to={"https://aplikasi-p5.site/Format-Essay-P5.docx"} target="_blank">
              <Button label={"Download Template Essay"} />
            </Link>
          </>
        )}

        {(roleName === "headmaster" || roleName === "teacher") && (
          <>
            <Button label={"Form Asesmen Siswa"} onClick={() => navigate("asesmen-siswa")} />
            <Button label={"Form Asesmen Kelompok"} onClick={() => navigate("asesmen-kelompok")} />
          </>
        )}
      </div>
    </div>
  );
};
