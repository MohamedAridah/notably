import { cn } from "@/lib/utils";

interface PageHeaderInterface {
  title: string;
}

export default function PageHeader({
  title,
  ...props
}: React.ComponentProps<"div"> & PageHeaderInterface) {
  return (
    <div className={cn("border-b pb-2 mb-7", props.className)}>
      <h2 className="text-lg capitalize font-semibold">{title}</h2>
    </div>
  );
}
