import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MemberSessionProvider } from "./context/MemberSession";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MemberSessionProvider><App /></MemberSessionProvider>
  </React.StrictMode>
);
