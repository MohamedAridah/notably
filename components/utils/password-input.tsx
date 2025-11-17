"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type PaswordInputProps = {
  placeholder: string;
};

export default function PasswordInput({
  placeholder,
  ...props
}: PaswordInputProps & React.ComponentProps<"input">) {
  const [showPassowrd, setShowPassowrd] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassowrd ? "text" : "password"}
        placeholder={placeholder}
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
      <div
        className="text-muted-foreground absolute top-1/2 -translate-y-1/2 right-1 hover:cursor-pointer gap-1 px-2  [&>svg:not([class*='size-'])]:size-4.5 has-[>svg]:px-2"
        onClick={() => setShowPassowrd((prev) => !prev)}
      >
        {showPassowrd ? <EyeOffIcon className="size-4 active:scale-95"/> : <EyeIcon className="size-4 active:scale-95"/>}
      </div>
    </div>
  );
}
