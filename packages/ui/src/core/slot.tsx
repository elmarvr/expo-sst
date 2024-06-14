import { View } from "react-native";
import type { ViewProps } from "react-native";

import * as React from "react";
import { mergeProps, mergeRefs } from "../lib/utils";

const SlotView = React.forwardRef<View, ViewProps>(
  ({ children, ...props }, ref) => {
    if (typeof children === "string" || !React.isValidElement(children)) {
      return null;
    }

    return React.cloneElement<ViewProps, React.ElementRef<typeof View>>(
      true ? children : <></>,
      {
        ...mergeProps(props, children.props),
        ref: mergeRefs(ref, (children as any).ref),
      }
    );
  }
);
SlotView.displayName = "Slot";

export const Slot = Object.assign(SlotView, {});
