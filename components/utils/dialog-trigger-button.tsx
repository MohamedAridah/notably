import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { Button, ButtonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import clsx from "clsx";

export type DialogTriggerButtonType = {
  asIcon?: boolean;
  withIcon?: boolean;
  iconHidden?: boolean;
};

type DialogTriggerButtonProps = {
  asIcon?: boolean; // Show Descriptive Icon
  iconHidden?: boolean; // Make Icon opacity-0
  withIcon?: boolean; // Show Icon with the text
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  icon: LucideIcon;
  state?: boolean;
  idleText: string;
  processText: string;
  className?: string;
  classNameAsIocn?: string;
};

const DialogTriggerButton = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerButtonProps
>(
  (
    {
      asIcon = false,
      iconHidden = false,
      withIcon = true,
      state,
      idleText,
      processText,
      size = "default",
      variant = "default",
      icon: Icon,
      className,
      classNameAsIocn,
      ...rest
    },
    ref
  ) => {
    if (asIcon)
      return (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          disabled={state}
          className={clsx(
            className,
            {
              "opacity-0 transition-opacity duration-200 hover:opacity-100 data-[state=open]:opacity-100":
                iconHidden,
            },
            classNameAsIocn
          )}
          aria-label={state ? processText : idleText}
          {...rest}
        >
          {state ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
        </Button>
      );

    return (
      <Button
        variant={variant}
        size={size}
        type="button"
        disabled={state}
        className={cn(className)}
        aria-label={state ? processText : idleText}
        {...rest}
      >
        {state ? (
          <>
            {withIcon && <Loader2 className="size-4 animate-spin" />}
            {processText}
          </>
        ) : (
          <>
            {withIcon && <Icon className="size-4" />}
            {idleText}
          </>
        )}
      </Button>
    );
  }
);

export default DialogTriggerButton;
