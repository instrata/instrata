import "@/index.css";
import "@/forward-console.ts";

import { createApp } from "vue";
import { i18n } from "@/i18n";
import AppWrapper from "./AppWrapper.vue";

createApp(AppWrapper)
    .use(i18n)
    .mount("#app");

if (import.meta.env.DEV) {
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
      event.preventDefault();
      window.location.reload();
    }
  });
}
