import { type DragDropEvent, getCurrentWindow } from "@tauri-apps/api/window";
import { useUnsubscribable } from "@/composables/useUnsubscribable.ts";

type DropEvent = Extract<DragDropEvent, { type: "drop" }>

export function useDropEvent(callback: (event: DropEvent) => void) {
  useUnsubscribable(() => getCurrentWindow().onDragDropEvent((event) => {
    if (event.payload.type === "drop") {
      callback(event.payload);
    }
  }));
}
