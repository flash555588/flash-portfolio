import { createApp } from "vue";
import { PortfolioApp } from "../app/vue-portfolio";
import "../app/globals.css";

document.documentElement.style.setProperty(
  "--font-geist-sans",
  'Inter, "Segoe UI", "Noto Sans SC", sans-serif',
);
document.documentElement.style.setProperty(
  "--font-geist-mono",
  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
);

createApp(PortfolioApp).mount("#app");
