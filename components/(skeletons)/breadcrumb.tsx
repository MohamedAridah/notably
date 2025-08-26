import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Fragment } from "react";

export default function BreadCrumbSkeleton({ length = 2 }: { length?: number }) {
  const items = new Array(length).fill(0);
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {items.map((_, index) => (
        <Fragment key={index}>
          <Skeleton className="h-4 w-[90px]" />
          <ChevronRight className="text-muted-foreground size-3.5" />
        </Fragment>
      ))}
    </div>
  );
}
