import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Шрифты ставятся пакетами @fontsource: те же Manrope и JetBrains Mono, что
// подключал next/font, с кириллицей и в переменном начертании (ось 200–800).
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/globals.css";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Не найден #root — проверь index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
