import React from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { Loader2, LucideIcon } from "lucide-react";
import { Button, ButtonVariants } from "@/components/ui/button";

export type DialogTriggerButtonType = {
  asLabel?: boolean;
  asIcon?: boolean;
  asIconHidden?: boolean;
};

interface ButtonStylesProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
}

interface Context {
  state?: boolean;
  idleText: string;
  processText?: string;
}

interface ButtonAsIconProps {
  icon: LucideIcon;
  classNameAsIocn?: string;
}

type DialogTriggerButtonProps = DialogTriggerButtonType &
  ButtonStylesProps &
  Context &
  ButtonAsIconProps & {
    className?: string;
  };

const DialogTriggerButton = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerButtonProps
>(
  (
    {
      asIcon = false,
      asIconHidden = false,
      asLabel = false,
      state = false,
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
    if (asIcon) {
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={state}
          aria-label={state ? processText : idleText}
          className={clsx(
            className,
            {
              "opacity-0 transition-opacity duration-200 hover:opacity-100 data-[state=open]:opacity-100":
                asIconHidden,
            },
            classNameAsIocn
          )}
          {...rest}
        >
          {state ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
        </Button>
      );
    }

    if (asLabel) {
      return (
        <Button
          type="button"
          variant="ghost"
          aria-label={idleText}
          className={clsx(
            "flex items-center justify-between gap-2 w-full",
            className
          )}
          {...rest}
        >
          <>
            {idleText}
            {state ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <Icon className="size-4" />
            )}
          </>
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={state}
        className={cn(className)}
        aria-label={state ? processText : idleText}
        {...rest}
      >
        {state ? (
          <>
            {<Loader2 className="size-4 animate-spin" />}
            {processText}
          </>
        ) : (
          <>
            {<Icon className="size-4" />}
            {idleText}
          </>
        )}
      </Button>
    );
  }
);

DialogTriggerButton.displayName = "DialogTriggerButton";

export default DialogTriggerButton;
