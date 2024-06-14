import * as React from "react";
import { View, type ViewProps, Text, type TextProps } from "react-native";
import { createFormControl } from "@gluestack-ui/form-control";
import { cva } from "../lib/utils";
import { VariantProps } from "cva";
import { IFormControlProps } from "@gluestack-ui/form-control/lib/typescript/types";

const formControlVariants = cva({
  base: "gap-y-1",
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
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

const FormControlContext = React.createContext<FormControlVariants | null>(
  null
);

export function useFormControlContext() {
  const context = React.useContext(FormControlContext);
  if (!context) {
    throw new Error(
      "useFormControlContext must be used within a <FormControl /> component"
    );
  }
  return context;
}

interface LabelAstrickProps extends TextProps, FormControlVariants {}
const LabelAstrick = React.forwardRef<Text, LabelAstrickProps>(
  ({ className, ...props }, ref) => {
    const { size } = useFormControlContext();
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
  return (
    <FormControlContext.Provider value={{ size }}>
      <UIFormControl
        {...props}
        className={formControlVariants({ className, size })}
      />
    </FormControlContext.Provider>
  );
};

export interface FormControlLabelProps extends TextProps {}
const FormControlLabel = ({
  className,
  children,
  ...props
}: FormControlLabelProps) => {
  const [textClassName, labelClassName] = ["", ""];

  return (
    <UIFormControl.Label {...props} className={labelClassName}>
      <UIFormControl.Label.Text className={textClassName}>
        {children}
      </UIFormControl.Label.Text>
    </UIFormControl.Label>
  );
};

export const FormControl = Object.assign(FormControlRoot, {
  Label: FormControlLabel,
});
