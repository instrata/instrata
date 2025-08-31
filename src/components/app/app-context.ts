import { createContext } from "reka-ui";
import type { Ref } from "vue";
import type { Guide } from "@/types/data.ts";

export interface AppContext {
    guide: Ref<Guide>
}

export const [injectAppContext, provideAppContext]
    = createContext<AppContext>("app");
