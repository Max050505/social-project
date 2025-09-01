import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store from "./store/index";
import "./index.css";
import { Provider } from "react-redux";
import "@ant-design/v5-patch-for-react-19";
import App from "./App";
import { App as AntApp } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntApp>
      <Provider store={store}>
        <App />
      </Provider>
    </AntApp>
  </StrictMode>
);
