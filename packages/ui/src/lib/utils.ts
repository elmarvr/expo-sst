import { StyleSheet } from "react-native";

import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cx, compose, cva } = defineConfig({
  hooks: {
    onComplete(className) {
      return twMerge(className);
    },
  },
});

export function mergeRefs<T>(
  ...refs: Array<React.ForwardedRef<T> | React.MutableRefObject<T>>
): React.ForwardedRef<T> {
  if (refs.length === 1) {
    return refs[0];
  }

  return (value: T | null) => {
    for (let ref of refs) {
      if (typeof ref === "function") {
        ref(value);
        return;
      }
      if (ref != null) {
        ref.current = value;
      }
    }
  };
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export function mergeProps<TProps extends Record<string, any>[]>(
  ...args: TProps
): UnionToIntersection<TProps[number]> {
  const result = { ...args[0] };

  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    for (const propName in props) {
      const propValue = props[propName];
      const value = result[propName];

      if (isHandler(propName)) {
        result[propName] = chain(value, propValue);
      }

      if (propName === "style") {
        result[propName] = StyleSheet.flatten([value, propValue]);
      }

      if (propName === "className") {
        result[propName] = cx(value, propValue);
      }

      if (propValue != null) {
        result[propName] = propValue;
      }
    }
  }

  return result as any;
}

export function isHandler(propName: string) {
  return (
    propName[0] === "o" &&
    propName[1] === "n" &&
    propName.charCodeAt(2) >= /* 'A' */ 65 &&
    propName.charCodeAt(2) <= /* 'Z' */ 90
  );
}

export function chain(...callbacks: any[]): (...args: any[]) => void {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
