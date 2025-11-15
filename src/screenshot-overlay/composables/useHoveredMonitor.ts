import { computed, type Ref } from "vue";
import { availableMonitors, type Monitor, primaryMonitor } from "@tauri-apps/api/window";
import { computedAsync, useMouse } from "@vueuse/core";

export function useHoveredMonitor(): Ref<Monitor | undefined> {
  const monitors = computedAsync(availableMonitors);
  const fallbackMonitor = computedAsync(primaryMonitor)
  const { x: mouseX, y: mouseY } = useMouse();

  return computed(() =>
    monitors.value?.find(m => (
        m.position.x <= mouseX.value
        && m.position.y <= mouseY.value
        && mouseX.value <= (m.position.x + m.size.width)
        && mouseY.value <= (m.position.y + m.size.height)
    ) ?? fallbackMonitor ?? undefined),
  );
}
