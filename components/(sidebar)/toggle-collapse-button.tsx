import { Button } from "@/components/ui/button";
import { CopyMinusIcon, CopyPlusIcon } from "lucide-react";

const ToggleCollapseButton = ({
  isExpanded,
  handler,
}: {
  isExpanded: boolean;
  handler: (value: boolean) => void;
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handler(!isExpanded)}
      title={`${isExpanded ? "Expand" : "Collapse"} Notebooks`}
    >
      {!isExpanded ? (
        <CopyMinusIcon className="size-3.5" />
      ) : (
        <CopyPlusIcon className="size-3.5" />
      )}
      <span className="sr-only">
        {!isExpanded ? "Expand" : "Collapse"} sidebar notebooks
      </span>
    </Button>
  );
};

export default ToggleCollapseButton;
