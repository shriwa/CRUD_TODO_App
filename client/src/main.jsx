import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import Router from "./Routes/Router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={Router} />
    </AuthContextProvider>
  </React.StrictMode>
);
