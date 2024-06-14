import * as React from "react";
import {
  Pressable,
  type PressableProps,
  Text,
  type TextProps,
  View,
  type ViewProps,
  ActivityIndicator,
  type ActivityIndicatorProps,
} from "react-native";
import { createButton } from "@gluestack-ui/button";
import type { IButtonGroupProps } from "@gluestack-ui/button/lib/typescript/types";
import { cva } from "../lib/utils";
import type { VariantProps } from "cva";

const buttonVariants = cva({
  base: "group flex flex-row gap-3 items-center justify-center rounded-md",
  variants: {
    variant: {
      default: "bg-primary active:opacity-90",
      destructive: "bg-destructive active:opacity-90",
      outline: "border border-input bg-background active:bg-accent",
      secondary: "bg-secondary",
      ghost: "active:bg-accent",
      link: "",
    },
    size: {
      default: "h-10 px-4 py-2 h-12 px-5 py-3",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8 h-14",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = cva({
  base: "text-sm text-base font-medium text-foreground",
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "group-active:text-accent-foreground",
      secondary:
        "text-secondary-foreground group-active:text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "text-lg",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const ButtonContext = React.createContext<{
  variants: VariantProps<typeof buttonVariants>;
} | null>(null);

export function useButtonContext() {
  const context = React.useContext(ButtonContext);
  if (!context) {
    throw new Error(
      "useButtonContext must be used within a <Button /> component"
    );
  }
  return context;
}

export const UIButton = createButton({
  Root: Pressable,
  Text: Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: View,
});

export interface ButtonRootProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {}
const ButtonRoot = React.forwardRef<View, ButtonRootProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <ButtonContext.Provider value={{ variants: { variant, size } }}>
        <UIButton
          {...props}
          className={buttonVariants({ className, variant, size })}
          ref={ref}
        />
      </ButtonContext.Provider>
    );
  }
);

export interface ButtonTextProps extends TextProps {}
const ButtonText = React.forwardRef<TextProps, ButtonTextProps>(
  ({ className, ...props }, ref) => {
    const { variants } = useButtonContext();

    return (
      <UIButton.Text
        {...props}
        className={buttonTextVariants({ className, ...variants })}
        ref={ref}
      />
    );
  }
);

export interface ButtonGroupProps extends IButtonGroupProps {}
const ButtonGroup = React.forwardRef<ViewProps, ButtonGroupProps>(
  (props, ref) => {
    return <UIButton.Group {...props} ref={ref} />;
  }
);

export interface ButtonSpinnerProps extends ActivityIndicatorProps {}
const ButtonSpinner = React.forwardRef<
  ActivityIndicatorProps,
  ButtonSpinnerProps
>((props, ref) => {
  return <UIButton.Spinner {...props} ref={ref} />;
});

export const Button = Object.assign(ButtonRoot, {
  Text: ButtonText,
  Group: ButtonGroup,
  Spinner: ButtonSpinner,
});
