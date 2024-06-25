import * as React from "react";
import { View, type ViewProps, Text, type TextProps } from "react-native";
import {
  createFormControl,
  useFormControlContext as __useFormControlContext,
} from "@gluestack-ui/form-control";

import { VariantProps } from "cva";
import { IFormControlProps } from "@gluestack-ui/form-control/lib/typescript/types";
import { cva, cx, mergeProps } from "../lib/utils";
import { useFieldState } from "./form";

const formControlVariants = cva({
  base: "gap-y-1",
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
});

const formControlLabelVariants = cva({
  base: "text-foreground font-medium flex-row",
  variants: {
    size: {
      sm: "",
      md: "text-base",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const formControlAstrickVariants = cva({
  base: "text-destructive",
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

type FormControlVariants = VariantProps<typeof formControlVariants>;

const FormControlVariantsContext =
  React.createContext<FormControlVariants | null>(null);

export function useFormControl() {
  const context = __useFormControlContext();
  const variants = React.useContext(FormControlVariantsContext);

  return { ...context, ...variants };
}

interface LabelAstrickProps extends TextProps, FormControlVariants {}
const LabelAstrick = React.forwardRef<Text, LabelAstrickProps>(
  ({ className, ...props }, ref) => {
    const { size } = useFormControl();

    return (
      <Text
        {...props}
        className={formControlAstrickVariants({ className, size })}
        ref={ref}
      />
    );
  }
);

const UIFormControl = createFormControl({
  Root: View,
  Label: View,
  LabelText: Text,
  LabelAstrick: LabelAstrick,
  Helper: View,
  HelperText: Text,
  Error: View,
  ErrorIcon: View,
  ErrorText: Text,
});

export interface FormControlProps
  extends ViewProps,
    IFormControlProps,
    FormControlVariants {}
const FormControlRoot = ({ size, className, ...props }: FormControlProps) => {
  const fieldState = useFieldState();

  const merged = mergeProps(props, {
    isInvalid: fieldState?.invalid,
  });

  return (
    <FormControlVariantsContext.Provider value={{ size }}>
      <UIFormControl
        {...merged}
        className={formControlVariants({
          className,
          size,
          isDisabled: props.isDisabled,
        })}
      />
    </FormControlVariantsContext.Provider>
  );
};

export interface FormControlLabelProps extends ViewProps {
  _text?: TextProps;
}
const FormControlLabel = ({
  className,
  _text,
  children,
  ...props
}: FormControlLabelProps) => {
  const { className: textClassName, ...textProps } = _text ?? {};
  const { isInvalid } = useFormControl();

  return (
    <UIFormControl.Label
      {...props}
      className={formControlLabelVariants({ className })}
    >
      <UIFormControl.Label.Text
        {...textProps}
        className={cx(
          "font-medium text-sm",
          isInvalid && "text-destructive",
          textClassName
        )}
      >
        {children}
      </UIFormControl.Label.Text>
    </UIFormControl.Label>
  );
};

export interface FormControlErrorProps extends ViewProps {
  _text?: TextProps;
}
const FormControlError = ({
  className,
  _text,
  children,
  ...props
}: FormControlErrorProps) => {
  const { className: textClassName, ...textProps } = _text ?? {};
  const fieldState = useFieldState();

  const message = fieldState?.error?.message ?? children;

  return (
    <UIFormControl.Error {...props} className={className}>
      <UIFormControl.Error.Text
        {...textProps}
        className={cx("text-destructive", textClassName)}
      >
        {message}
      </UIFormControl.Error.Text>
    </UIFormControl.Error>
  );
};

export const FormControl = Object.assign(FormControlRoot, {
  Label: FormControlLabel,
  Error: FormControlError,
});
