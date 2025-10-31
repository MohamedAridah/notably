import { cn } from "@/lib/tiptap-utils";
import { Loader2 } from "lucide-react";

interface LoadingSwapProps {
  children?: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  className?: string;
}

export default function LoadingSwap({
  children,
  className,
  isLoading,
  loadingText,
}: LoadingSwapProps) {
  return isLoading ? (
    <>
      <Loader2 className={cn("animate-spin size-4", className)} />
      {loadingText && loadingText}
    </>
  ) : (
    <>{children}</>
  );
}
