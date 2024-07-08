import { StyleSheet } from "react-native";

import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

import { cssInterop } from "nativewind";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";

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

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

const STATE_PREFIX = "data-";
export function withState<
  TComponent extends React.ComponentType<{ className?: string }>,
>(component: TComponent): TComponent {
  const Comp = component;

  return (props: { className?: string; states: Record<string, any> }) => {
    const { className, states, ...rest } = props;

    const stateVariants = React.useMemo(() => {
      const parts = className?.split(" ") ?? [];
      const variants: Record<string, any> = {};

      for (const part of parts) {
        if (part.startsWith(STATE_PREFIX)) {
          const [key, value] = part.replace(STATE_PREFIX, "").split(":");
          variants[key] = { ["true"]: `${variants[key]?.true ?? ""} ${value}` };
        }
      }

      return cva({
        base: parts.join(" "),
        variants,
      });
    }, [className, states]);

    return <Comp className={stateVariants(states)} {...rest} />;
  };
}
