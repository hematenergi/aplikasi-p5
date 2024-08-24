import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import AsesmenKelompokPage from "../pages/asesmen/AsesmenKelompokPage";
import AsesmenSiswaPage from "../pages/asesmen/AsesmenSiswaPage";
import { ErrorPage } from "../pages/error/ErrorPage";
import { Home } from "../pages/Home/Home";
import SiswaPage from "../pages/siswa/SiswaPage";
import LoginPage from "../pages/auth/Login";
import AuthLayout from "../AuthLayout";
import RegisterPage from "../pages/auth/Register";

// Assuming you have a function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // or however you store your token
  return !!token; // returns true if token exists, false otherwise
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "siswa",
        element: (
          <ProtectedRoute>
            <SiswaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "asesmen-siswa",
        element: (
          <ProtectedRoute>
            <AsesmenSiswaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "asesmen-kelompok",
        element: (
          <ProtectedRoute>
            <AsesmenKelompokPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
