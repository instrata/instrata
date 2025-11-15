import type { ConverterRule, EscapeRule } from "@/lib/html-conv/converter.ts";
import { repeat } from "@/lib/html-conv/utilities.ts";

export const ESCAPES: EscapeRule[] = [
  [/\\/g, "\\\\"],
  [/\*/g, "\\*"],
  [/^-/g, "\\-"],
  [/^\+ /g, "\\+ "],
  [/^(=+)/g, "\\$1"],
  [/^(#{1,6}) /g, "\\$1 "],
  [/`/g, "\\`"],
  [/^~~~/g, "\\~~~"],
  [/\[/g, "\\["],
  [/]/g, "\\]"],
  [/^>/g, "\\>"],
  [/_/g, "\\_"],
  [/^(\d+)\. /g, "$1\\. "],
];

export const RULES: ConverterRule[] = [
  // block rules
  {
    filter: "p",
    replacement: (content) => {
      return `\n\n${content}\n\n`;
    },
  },
  {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node) => {
      const hLevel = Number(node.nodeName.charAt(1));

      if (hLevel < 3) {
        const underline = repeat((hLevel === 1) ? "=" : "-", content.length);
        return `\n\n${content}\n${underline}\n\n`;
      } else {
        return `\n\n${repeat("#", hLevel)} ${content}\n\n`;
      }
    },
  },
  {
    filter: "blockquote",
    replacement: (content) => {
      content = content.replace(/^\n+|\n+$/g, "");
      content = content.replace(/^/gm, "> ");
      return `\n\n${content}\n\n`;
    }
  },
  {
    filter: ["ul", "ol"],
    replacement: (content, node) => {
      const parent = node.parentNode as HTMLElement;
      if (parent.nodeName === "LI" && parent.lastElementChild === node) {
        return `\n${content}`;
      } else {
        return `\n\n${content}\n\n`;
      }
    }
  },
  {
    filter: "li",
    replacement: (content, node) => {
      const parent = node.parentNode as HTMLElement;
      const prefix: string = parent.nodeName === "OL" ? "1. " : "*   ";
      content = content
          .replace(/^\n+/, "")  // remove leading newlines
          .replace(/\n+$/, "\n")  // collapse trailing newlines
          .replace(/\n/gm, "\n" + " ".repeat(prefix.length));  // indent

      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "");
    },
  },
  {
    filter: (node) => (
        node.nodeName === "PRE" &&
        !!node.firstChild && node.firstChild.nodeName === "CODE"
    ),
    replacement: (_, node) => {
      const className = (node.firstChild as HTMLElement).getAttribute("class") ?? "";
      const code = node.firstChild!.textContent!;
      const language = (className.match(/language-(\S+)/) ?? [null, ""])[1]

      const fenceChar = "`";
      const fenceLength = Array.from(code.matchAll(new RegExp("^" + fenceChar + "{3,}", "gm"))).reduce((length, match) => {
        return Math.max(length, match[0].length + 1);
      }, 3);

      const fence = repeat(fenceChar, fenceLength);

      return (
          `\n\n${fence}${language}\n` +
          code.replace(/\n$/, "") +
          `\n${fence}\n\n`
      );
    }
  },
  {
    filter: "hr",
    replacement: () => {
      return `\n\n---\n\n`;
    }
  },
  // inline rules
  {
    filter: "br",
    replacement: () => {
      return `  `;
    },
  },
  {
    filter: (node) => (
        node.nodeName === "A" && !!node.getAttribute("href")
    ),
    replacement: (content, node) => {
      const href = node.getAttribute("href")!
          .replace(/([()])/g, "\\$1");
      let title = cleanAttribute(node.getAttribute("title"));
      if (title) title = ` "${title.replace(/"/g, "\\\"")}"`
      return `[${content}](${href}${title})`;
    },
  },
  {
    filter: ["em", "i"],
    replacement: (content) => {
      if (!content.trim()) return "";
      return `_${content}_`;
    },
  },
  {
    filter: ["strong", "b"],
    replacement: (content) => {
      if (!content.trim()) return "";
      return `**${content}**`;
    },
  },
  {
    filter: (node) => {
      const hasSiblings = !!node.previousSibling || !!node.nextSibling;
      const isCodeBlock = node.parentNode!.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: (content) => {
      if (!content) return "";
      content = content.replace(/\r?\n|\r/g, " ");

      const extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
      const delimiterLength = Array.from(content.matchAll(/`+/g)).reduce((length, match) => {
        return Math.max(length, match[0].length + 1);
      }, 1);
      const delimiter = repeat("`", delimiterLength);

      return `${delimiter}${extraSpace}${content}${extraSpace}${delimiter}`;
    },
  },
  {
    filter: "img",
    replacement: (_, node) => {
      const alt = cleanAttribute(node.getAttribute("alt"));
      const src = node.getAttribute("src") ?? "";
      const title = cleanAttribute(node.getAttribute("title"));
      const titlePart = title ? ` "${title}"` : "";
      return src ? `![${alt}](${src}${titlePart})` : "";
    },
  },
];

function cleanAttribute(attribute: string | null): string {
  return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : ""
}
