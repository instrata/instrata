import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function htmlToText(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent!;
}
