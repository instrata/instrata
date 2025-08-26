import "./index.css";
import "vue-sonner/style.css";

import { createApp } from "vue";
import AppWrapper from "./AppWrapper.vue";
import { router } from "@/router.ts";


createApp(AppWrapper)
    .use(router)
    .mount("#app");
