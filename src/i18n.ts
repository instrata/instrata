import messages from "@intlify/unplugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  locale: localStorage.getItem("i18n-locale") ?? navigator.language,
  fallbackLocale: "en",
  messages,
});
