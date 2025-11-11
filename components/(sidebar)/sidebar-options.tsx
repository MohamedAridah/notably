import { Button } from "@/components/ui/button";
import { CopyMinusIcon, CopyPlusIcon } from "lucide-react";

const SidebarOptions = ({
  isExpanded,
  handler,
}: {
  isExpanded: boolean;
  handler: (value: boolean) => void;
}) => {
  return (
    <div className="group-data-[collapsible=icon]:hidden flex gap-1 justify-end -mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handler(!isExpanded)}
        asChild
      >
        <button title={`${isExpanded ? "Expand" : "Collapse"} Notebooks`}>
          {!isExpanded ? (
            <CopyMinusIcon className="size-3.5" />
          ) : (
            <CopyPlusIcon className="size-3.5" />
          )}
          <span className="sr-only">
            {!isExpanded ? "Expand" : "Collapse"} sidebar notebooks
          </span>
        </button>
      </Button>
    </div>
  );
};

export default SidebarOptions;
