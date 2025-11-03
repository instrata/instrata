import { onBeforeUnmount, onMounted, ref } from "vue";
import { type DragDropEvent, getCurrentWindow } from "@tauri-apps/api/window";

type DropEvent = Extract<DragDropEvent, { type: "drop" }>

export function useDropEvent(callback: (event: DropEvent) => void) {
  const unlisten = ref<() => void>();

  onMounted(async () => {
    const win = getCurrentWindow();
    unlisten.value = await win.onDragDropEvent((event) => {
      if (event.payload.type === "drop") {
        callback(event.payload);
      }
    });
  });

  onBeforeUnmount(() => {
    unlisten.value?.();
  });
}
