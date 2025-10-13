import "./index.css";
import "vue-sonner/style.css";

import { createApp } from "vue";
import AppWrapper from "./AppWrapper.vue";
import { router } from "@/router.ts";
import { i18n } from "@/i18n";

createApp(AppWrapper)
    .use(router)
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
