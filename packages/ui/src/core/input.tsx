import * as React from "react";
import {
  View,
  type ViewProps,
  Pressable,
  type PressableProps,
  TextInput,
  type TextInputProps,
} from "react-native";
import { createInput } from "@gluestack-ui/input";
import type { IInputFieldProps } from "@gluestack-ui/input/lib/typescript/types";
import type { VariantProps } from "cva";
import { cva, mergeProps } from "../lib/utils";
import { Slot } from "./slot";
import { useFormControl } from "./form-control";
import { useController } from "react-hook-form";

const inputGroupVariants = cva({
  base: "flex flex-row h-10 w-full rounded-md border border-input bg-background px-3 py-2 gap-3 flex-none",
  variants: {
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
    isInvalid: {
      true: "border-destructive",
      false: "",
    },
  },
});

const inputVariants = cva({
  base: "text-base lg:text-sm leading-[1.25] flex-1",
  variants: {
    isInvalid: {
      true: "text-destructive",
      false: "text-foreground",
    },
  },
});

const inputSlotVariants = cva({
  base: "flex items-center justify-center h-full",
});

export type InputGroupVariants = VariantProps<typeof inputGroupVariants>;

const InputGroupContext = React.createContext<InputGroupVariants | null>(null);

// We don't want to wrap the root in a view
// We forward the ref to avoid a warning
const Root = React.forwardRef<any, { children: React.ReactNode }>(
  (props, _) => {
    return <>{props.children}</>;
  }
);

const UIInput = createInput({
  Root: Root,
  Icon: View,
  Slot: Pressable,
  Input: TextInput,
});

export interface InputGroupProps extends ViewProps, InputGroupVariants {
  asChild?: boolean;
}
const InputGroup = React.forwardRef<View, InputGroupProps>(
  ({ isDisabled, isInvalid, asChild, className, ...props }, ref) => {
    const context = useFormControl();
    const Comp = asChild ? Slot : View;

    const merged = mergeProps(context, { isDisabled, isInvalid });

    return (
      <InputGroupContext.Provider value={merged}>
        <UIInput>
          <Comp
            {...props}
            className={inputGroupVariants({
              className,
              isDisabled,
              isInvalid: merged.isInvalid,
            })}
            ref={ref}
          />
        </UIInput>
      </InputGroupContext.Provider>
    );
  }
);

export interface InputSlotProps extends PressableProps {}
const InputSlot = React.forwardRef<View, InputSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <UIInput.Slot
        {...props}
        className={inputSlotVariants({ className })}
        ref={ref}
      />
    );
  }
);

export interface InputProps extends IInputFieldProps, TextInputProps {}
const BaseInput = React.forwardRef<TextInputProps, InputProps>(
  ({ className, isDisabled, isInvalid, ...props }, ref) => {
    const context = React.useContext(InputGroupContext)!;

    const merged = mergeProps(context, { isDisabled, isInvalid });

    return (
      <UIInput.Input
        {...props}
        editable={!merged.isDisabled}
        className={inputVariants({ className, isInvalid: merged.isInvalid })}
        ref={ref}
      />
    );
  }
);

const InputInput = React.forwardRef<TextInputProps, InputProps>(
  (props, ref) => {
    const context = React.useContext(InputGroupContext);

    if (!context) {
      return (
        <InputGroup asChild {...props}>
          <BaseInput ref={ref} />
        </InputGroup>
      );
    }

    return <BaseInput {...props} ref={ref} />;
  }
);

export const Input = Object.assign(InputInput, {
  Group: InputGroup,
  Slot: InputSlot,
});
