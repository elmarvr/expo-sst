import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cx, compose, cva } = defineConfig({
  hooks: {
    onComplete(className) {
      return twMerge(className);
    },
  },
});
