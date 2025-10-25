
import { cn } from "@/lib/utils";
import clsx from "clsx";

type PanelProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const Panel = ({
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & PanelProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border px-7 lg:px-10 py-5 mb-7",
        props.className
      )}
    >
      {title && (
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <div>
            <h2 className=" capitalize font-semibold">{title}</h2>
            {description && <p className="text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {props.children}
    </div>
  );
};

export default Panel;
