import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";
import { initCloudAuth, pullCloudIntoIndexedDB, pushAllLocalToCloud } from "./cloudSync";
import { ensureSeeded } from "./db";

registerSW({ immediate: true });

async function boot() {
  await initCloudAuth();
  await pullCloudIntoIndexedDB();
  await ensureSeeded();
  await pushAllLocalToCloud();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

boot().catch((err) => {
  console.error(err);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});