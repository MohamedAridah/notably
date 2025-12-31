import React from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { Button, ButtonVariants } from "@/components/ui/button";
import IconMenu from "@/components/utils/icon-menu";
import LoadingSwap from "@/components/utils/loading-swap";
import { LucideIcon } from "lucide-react";

type Appearance = {
  asLabel?: boolean;
  asIcon?: boolean;
  asIconHidden?: boolean;
};

export type TriggerAppearance = {
  trigger?: Partial<Appearance>;
  withTrigger?: boolean;
};

interface TriggerStyles {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  className?: string;
}

interface Context {
  state?: boolean;
  idleText: string;
  processText?: string;
}

interface TriggerAsIcon {
  icon: LucideIcon;
  classNameAsIocn?: string;
}

export type TriggerProps = Appearance &
  TriggerStyles &
  Context &
  TriggerAsIcon &
  React.ComponentProps<typeof Button>;

const DialogTriggerButton = React.forwardRef<HTMLButtonElement, TriggerProps>(
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
      className,

      icon: Icon,
      classNameAsIocn,

      ...rest
    },
    ref
  ) => {
    if (asIcon) {
      return (
        <Button
          ref={ref}
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
          <LoadingSwap isLoading={state}>
            <Icon className="size-4" />
          </LoadingSwap>
        </Button>
      );
    }

    if (asLabel) {
      return (
        <button
          onClick={rest.onClick}
          className="w-full text-start"
          disabled={state}
        >
          <IconMenu text={idleText} icon={<Icon className="size-4" />} />
        </button>
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
        <LoadingSwap isLoading={state} loadingText={processText}>
          <>
            {<Icon className="size-4" />}
            {idleText}
          </>
        </LoadingSwap>
      </Button>
    );
  }
);

DialogTriggerButton.displayName = "DialogTriggerButton";

export default DialogTriggerButton;
