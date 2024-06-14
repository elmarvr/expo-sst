import * as React from "react";
import { createAvatar } from "@gluestack-ui/avatar";
import {
  View,
  type ViewProps,
  Image,
  type ImageProps,
  Text,
  type TextProps,
} from "react-native";
import { cva } from "../lib/utils";
import { VariantProps } from "cva";

const avatarVariants = cva({
  base: "rounded-full justify-center items-center shrink-0 overflow-hidden relative",
  variants: {
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-12",
      lg: "size-16",
      xl: "size-24",
      "2xl": "size-32",
    },
  },
});

const avatarFallbackVariants = cva({
  base: "font-medium text-foreground",
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
      xl: "text-3xl",
      "2xl": "text-5xl",
    },
  },
});

const avatarImageVariants = cva({
  base: "w-full h-full aspect-square",
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

const AvatarContext = React.createContext<AvatarVariants | null>(null);

export function useAvatarContext() {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error(
      "useAvatarContext must be used within a <Avatar /> component"
    );
  }
  return context;
}

const UIAvatar = createAvatar({
  Root: View,
  Image: Image,
  Badge: View,
  Group: View,
  FallbackText: Text,
});

export interface AvatarProps extends ViewProps, AvatarVariants {}
const AvatarRoot = React.forwardRef<ViewProps, AvatarProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <UIAvatar
        {...props}
        className={avatarVariants({ className, size })}
        ref={ref}
      />
    );
  }
);

export interface AvatarFallbackProps extends TextProps {}
const AvatarFallback = React.forwardRef<TextProps, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { size } = useAvatarContext();
    return (
      <UIAvatar.FallbackText
        {...props}
        className={avatarFallbackVariants({ className, size })}
        ref={ref}
      />
    );
  }
);

export interface AvatarImageProps extends ImageProps {}
const AvatarImage = React.forwardRef<ImageProps, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <UIAvatar.Image
        {...props}
        className={avatarImageVariants({ className })}
        ref={ref}
      />
    );
  }
);

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
