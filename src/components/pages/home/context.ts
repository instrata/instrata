import { createContext } from "reka-ui";
import type { Ref } from "vue";
import type { Guide, GuideInfo, } from "@/types/storage.ts";

export type HomeContext = {
    displayMode: Ref<"list" | "grid">
    guidesAndInfos: Ref<Array<[Guide, GuideInfo]>>
    searchString: Ref<string>
}

export const [injectHomeContext, provideHomeContext]
    = createContext<HomeContext>("home");
