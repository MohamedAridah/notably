import React from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { Loader2, LucideIcon } from "lucide-react";
import { Button, ButtonVariants } from "@/components/ui/button";
import IconMenu from "@/components/utils/icon-menu";

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

type TriggerProps = Appearance & TriggerStyles & Context & TriggerAsIcon;

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
          {state ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
        </Button>
      );
    }

    if (asLabel) {
      return <IconMenu text={idleText} icon={<Icon className="size-4" />} />;
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
