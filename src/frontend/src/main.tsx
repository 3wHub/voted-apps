import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import App from "./App";
import Layout from '@/lib/layout';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <h1> TES</h1>
    </Layout>
  </React.StrictMode>
);
