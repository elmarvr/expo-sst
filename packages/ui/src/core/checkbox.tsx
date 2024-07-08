import { View, Pressable, type ViewProps } from "react-native";
import { createCheckbox } from "@gluestack-ui/checkbox";
import * as React from "react";
import type { ICheckboxProps } from "@gluestack-ui/checkbox/lib/typescript/types";
import { cx, withState } from "../lib/utils";
import { CheckIcon } from "./icon";
import { Slot } from "./slot";

export interface IconProps extends ViewProps {
  asChild?: boolean;
}
const Icon = React.forwardRef<View, IconProps>(({ asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : View;

  return <Comp {...props} ref={ref} />;
});

const UICheckbox = createCheckbox({
  Root: Pressable,
  Group: View,
  Label: View,
  Indicator: withState(View),
  Icon: Icon,
});

export interface CheckboxProps extends ICheckboxProps {}

const CheckboxRoot = React.forwardRef<ViewProps, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <UICheckbox
        {...props}
        className={cx(className, "inline-flex")}
        ref={ref}
      />
    );
  }
);

const CheckboxIndicator = React.forwardRef<ViewProps, ViewProps>(
  ({ className, ...props }, ref) => {
    return (
      <UICheckbox.Indicator
        {...props}
        className={cx(
          className,
          "h-5 w-5 rounded border-border border state-checked:bg-red-500 justify-center items-center data-checked:bg-primary data-checked:border-primary"
        )}
        ref={ref}
      />
    );
  }
);

const CheckboxIcon = React.forwardRef<ViewProps, IconProps>(
  ({ className, ...props }, ref) => {
    return (
      <UICheckbox.Icon
        {...props}
        className={cx(className, "text-primary-foreground w-4 h-4")}
        ref={ref}
        asChild
      >
        <CheckIcon size={16} />
      </UICheckbox.Icon>
    );
  }
);

export const Checkbox = Object.assign(CheckboxRoot, {
  Indicator: CheckboxIndicator,
  Icon: CheckboxIcon,
});
