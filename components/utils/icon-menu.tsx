import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MenuIconProps {
  icon: ReactNode;
  text: string;
  className?: string;
}

export default function IconMenu({ className, icon, text }: MenuIconProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 w-full h-full hover:cursor-pointer",
        className
      )}
    >
      {icon}
      <span className="text-sm flex-1">{text}</span>
    </div>
  );
}
