import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

export const TipTapSingleLineExtension = Extension.create({
  name: "no_new_line",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          handleKeyDown: (_view, event) => {
            if (event.key === "Enter") {
              return true; // Suppress default behavior
            }
          }
        }
      })
    ];
  }
});
