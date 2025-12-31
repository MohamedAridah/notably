import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MenuIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  text: string;
  className?: string;
}

export default function IconMenu({
  className,
  icon,
  text,
  ...props
}: MenuIconProps) {
  return (
    <div
      className={cn(
        "flex flex-row rtl:flex-row-reverse items-center gap-2 w-full h-full hover:cursor-pointer",
        className
      )}
      {...props}
    >
      {icon}
      <span className="text-sm flex-1 rtl:text-end">{text}</span>
    </div>
  );
}
