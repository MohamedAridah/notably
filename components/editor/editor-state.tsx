import { Loader2Icon } from "lucide-react";

const EditorState = ({ state, text }: { state: boolean; text: string }) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const characters = text.trim().length;

  return (
    <div className="backdrop-blur-lg sticky left-0 top-0 w-full bg-white/44 dark:bg-transparent p-3 z-11">
      <div className="flex items-center justify-between">
        <div className="max-sm:hidden" aria-hidden="true" tabIndex={-1}></div>
        {state ? (
          <div className="flex items-center gap-1 animate-pulse">
            <Loader2Icon className="animate-spin size-4" />
            <span className="text-xs font-medium text-muted-foreground">
              Saving your changes...
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="size-2.5 rounded-full animate-caret-blink bg-green-400" />
            <span className="text-xs font-medium text-muted-foreground">
              You are up to date
            </span>
          </div>
        )}

        <span
          aria-live="polite"
          className="flex items-center text-[13px] text-muted-foreground font-medium"
        >
          {words} words <span className="mx-1.5">|</span> {characters}{" "}
          characters
        </span>
      </div>
    </div>
  );
};

export default EditorState;
