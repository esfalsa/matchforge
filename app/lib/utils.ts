import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pageTitle(title?: string) {
  return title ? `${title} | MatchForge` : "MatchForge";
}
