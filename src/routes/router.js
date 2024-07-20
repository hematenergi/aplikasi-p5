import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"
import AsesmenKelompokPage from "../pages/asesmen/AsesmenKelompokPage"
import AsesmenSiswaPage from "../pages/asesmen/AsesmenSiswaPage"
import { ErrorPage } from "../pages/error/ErrorPage"
import { Home } from "../pages/Home/Home"
import SiswaPage from "../pages/siswa/SiswaPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "siswa",
        element: <SiswaPage />,
      },
      {
        path: "asesmen-siswa",
        element: <AsesmenSiswaPage />,
      },
      {
        path: "asesmen-kelompok",
        element: <AsesmenKelompokPage />,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
