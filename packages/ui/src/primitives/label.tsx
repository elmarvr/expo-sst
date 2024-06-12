import * as React from "react";
import { Pressable, Text as RNText } from "react-native";
import type { ViewStyle } from "react-native";
import * as Slot from "./slot";
import type {
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  TextRef,
} from "./types";

export interface LabelRootProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
const Root = React.forwardRef<
  PressableRef,
  Omit<SlottablePressableProps, "children" | "hitSlop" | "style"> &
    LabelRootProps
>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.Pressable : Pressable;
  return <Component ref={ref} {...props} />;
});

Root.displayName = "RootNativeLabel";

export interface LabelTextProps {
  /**
   * Equivalent to `id` so that the same value can be passed as `aria-labelledby` to the input element.
   */
  nativeID: string;
}
const Text = React.forwardRef<TextRef, SlottableTextProps & LabelTextProps>(
  ({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return <Component ref={ref} {...props} />;
  }
);

Text.displayName = "TextNativeLabel";

export { Root, Text };
