import LoadingSwap from "@/components/utils/loading-swap";

const EditorState = ({ state }: { state: boolean }) => {
  return (
    <div className="backdrop-blur-lg sticky left-0 top-0 w-full bg-white/44 p-3 z-11">
      <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
        <LoadingSwap isLoading={state} loadingText="Saving your changes...">
          <span className="size-2.5 rounded-full animate-caret-blink bg-green-400" />
          You are up to date
        </LoadingSwap>
      </div>
    </div>
  );
};

export default EditorState;
