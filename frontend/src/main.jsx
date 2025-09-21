import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";

import App from "./app";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Consultants from "./pages/consultants";
import ConsultantDetail from "./pages/consultant-detail";
import Resources from "./pages/resources";
import Contact from "./pages/contact";
import About from "./pages/about";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import NotFound from "./pages/not-found";
import Login from "./pages/login";
import Signup from "./pages/signup";
import RequireAuth from "./components/auth/require-auth";
import AuthLayout from "./components/layout/auth-layout";


const router = createBrowserRouter([
  // Main site with header/footer
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "chat",
        element: (
          <RequireAuth>
            <Chat />
          </RequireAuth>
        ),
      },
      { path: "consultants", element: <Consultants /> },
      { path: "consultants/:id", element: <ConsultantDetail /> },
      { path: "resources", element: <Resources /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
    ],
  },
  // Auth pages WITHOUT header/footer
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  // Global 404
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);