import React from "react"
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import App from "../App"
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
        path: "asesmen",
        element: (
          <div>
            <h1>asesmen</h1>
            <Link to="about">About Us</Link>
          </div>
        ),
      },
      {
        path: "asesmen-kelompok",
        element: (
          <div>
            <h1>asesmen kelompok</h1>
            <Link to="about">About Us</Link>
          </div>
        ),
      },
    ],
  },
  {
    path: "/siswa",
    element: <SiswaPage />,
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
