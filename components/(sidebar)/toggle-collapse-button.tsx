import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CopyMinusIcon, CopyPlusIcon } from "lucide-react";

const ToggleCollapseButton = ({
  isExpanded,
  handler,
}: {
  isExpanded: boolean;
  handler: (value: boolean) => void;
}) => {
  const t = useTranslations("CollapseNotebooksButton");
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handler(!isExpanded)}
      title={isExpanded ? t("expand") : t("collapse")}
    >
      {!isExpanded ? (
        <CopyMinusIcon className="size-3.5" />
      ) : (
        <CopyPlusIcon className="size-3.5" />
      )}
      <span className="sr-only">
        {!isExpanded ? t("expand") : t("collapse")}
      </span>
    </Button>
  );
};

export default ToggleCollapseButton;
