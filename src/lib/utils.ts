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


export function sortByKey<T>(array: T[], key: (e: T) => string, ascending = true) {
  const sign = ascending ? 1 : -1;
  return array
      .map((e) => [e, key(e)] as const)
      .sort(([_a, a], [_b, b]) => sign * a.localeCompare(b))
      .map(([e]) => e)
}
