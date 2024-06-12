import * as React from "react";
import * as LabelPrimitive from "../primitives/label";
import { cx } from "../lib/utils";

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Text>;

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  LabelProps
>(
  (
    { className, onPress, onLongPress, onPressIn, onPressOut, ...props },
    ref
  ) => (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cx(
          "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
