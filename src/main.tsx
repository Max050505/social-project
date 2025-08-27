import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store from "./store/index";
import "./index.css";
import { Provider } from "react-redux";
import "@ant-design/v5-patch-for-react-19";
import App from "./App";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>
);
