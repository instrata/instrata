import { type MaybeRefOrGetter, toValue, shallowRef, type ShallowRef } from "vue";
import { useUnsubscribable } from "@/composables/useUnsubscribable.ts";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import type { PhysicalPosition } from "@tauri-apps/api/dpi";
import type { DragDropEvent } from "@tauri-apps/api/window";

type UseDropZoneOptions = {
  onDrop?: (paths: string[], event: Extract<DragDropEvent, { type: "drop" }>) => void
  onEnter?: (paths: string[], event: Extract<DragDropEvent, { type: "over" }>) => void
  onLeave?: (paths: string[], event: Extract<DragDropEvent, { type: "over" }>) => void
  onOver?: (paths: string[], event: Extract<DragDropEvent, { type: "over" }>) => void
  // dataType?: MaybeRef<string[]> | ((types: readonly string[]) => boolean)
  multiple?: boolean
}

type UseDropZoneReturn = {
  paths: ShallowRef<string[] | null>
  isDuringDropPhase: ShallowRef<boolean>
  isOverDropZone: ShallowRef<boolean>
}

export function useDropZone(
    target: MaybeRefOrGetter<HTMLElement | Document | null | undefined>,
    options: UseDropZoneOptions
): UseDropZoneReturn {
  const isDuringDropPhase = shallowRef(false);
  const isOverDropZone = shallowRef(false);
  let lastOverDropZone: boolean = false;
  const paths = shallowRef<string[] | null>(null);

  function getPaths(event: DragDropEvent): string[] | null {
    const list = (event.type === "enter" || event.type === "drop") ? event.paths : [];
    return list.length === 0 ? null : (options.multiple ? list : [list[0]!]);
  }

  function checkIfHovered(position: PhysicalPosition): boolean {
    const root = toValue(target);
    if (!root) return false;
    let cursor: Element | null =  document.elementFromPoint(position.x, position.y);
    while (cursor) {
      if (cursor === root) return true;
      cursor = cursor.parentElement;
    }
    return false;
  }

  useUnsubscribable(() => getCurrentWebview().onDragDropEvent((e) => {
    const event = e.payload;

    switch (event.type) {
      case "enter":
        isDuringDropPhase.value = true;
        paths.value = getPaths(event);
        break;
      case "leave":
        isDuringDropPhase.value = false;
        isOverDropZone.value = false;
        paths.value = [];
        break;
      case "over":
        isDuringDropPhase.value = true;
        lastOverDropZone = isOverDropZone.value;
        isOverDropZone.value = checkIfHovered(event.position);
        if (lastOverDropZone !== isOverDropZone.value) {
          if (isOverDropZone.value) {
            options.onEnter?.(paths.value!, event);
          } else {
            options.onLeave?.(paths.value!, event);
          }
        }
        if (isOverDropZone.value) {
          options.onOver?.(paths.value!, event);
        }
        break;
      case "drop":
        if (checkIfHovered(event.position)) {
          options.onDrop?.(event.paths, event);
        }
        isDuringDropPhase.value = false;
        isOverDropZone.value = false;
        paths.value = [];
        break;
    }
  }));

  return {
    paths,
    isOverDropZone,
    isDuringDropPhase,
  };
}
