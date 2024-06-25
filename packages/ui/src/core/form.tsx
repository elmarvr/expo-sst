import * as React from "react";
import {
  View,
  Pressable,
  type ViewProps,
  type PressableProps,
} from "react-native";
import {
  ControllerFieldState,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormProps as __UseFormProps,
  useForm as __useForm,
  useController,
} from "react-hook-form";
import type { Schema } from "zod";
import { chain, cx } from "../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "./slot";

const FormContext = React.createContext<{
  onSubmit?: PressableProps["onPress"];
} | null>(null);

export interface FormProps extends ViewProps {
  onSubmit?: PressableProps["onPress"];
}
const FormRoot = React.forwardRef<View, FormProps>(
  ({ onSubmit, className, ...props }, ref) => {
    return (
      <FormContext.Provider value={{ onSubmit }}>
        <View className={cx("gap-y-5", className)} ref={ref} {...props} />
      </FormContext.Provider>
    );
  }
);

const FormFieldContext = React.createContext<ControllerFieldState | null>(null);

export function useFieldState() {
  return React.useContext(FormFieldContext);
}

export interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render" | "rules"> {
  children: ControllerProps<TFieldValues, TName>["render"];
}
const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  children,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  const state = useController(props);

  return (
    <FormFieldContext.Provider value={state.fieldState}>
      {children(state)}
    </FormFieldContext.Provider>
  );
};

export interface FormTriggerProps extends PressableProps {
  asChild?: boolean;
}
const FormTrigger = React.forwardRef<View, FormTriggerProps>(
  ({ onPress, asChild, ...props }, ref) => {
    const context = React.useContext(FormContext);
    const Comp = asChild ? Slot : (Pressable as any);

    return (
      <Comp {...props} ref={ref} onPress={chain(context?.onSubmit, onPress)} />
    );
  }
);

export interface UseFormProps<TSchema extends Schema>
  extends Omit<__UseFormProps<TSchema["_input"]>, "resolver"> {
  schema: TSchema;
}
export function useForm<TSchema extends Schema>(props: UseFormProps<TSchema>) {
  return __useForm({
    ...props,
    resolver: zodResolver(props.schema),
  });
}

export const Form = Object.assign(FormRoot, {
  Trigger: FormTrigger,
  Field: FormField,
});
