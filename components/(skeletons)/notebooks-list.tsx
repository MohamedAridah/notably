import { Skeleton } from "@/components/ui/skeleton";
import { NotebookIcon } from "lucide-react";

export default function NotebooksListSkeleton() {
  const items = new Array(5).fill(0);

  return (
    <div className="flex flex-col gap-2 items-end">
      <Skeleton className="w-36 h-8"/>
      <div className="w-full grid md:grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 items-start mt-4 py-5">
        {items.map((_, index) => (
          <div
            className="shadow-2xs rounded-xl border p-4 px-3 flex flex-col items-center justify-between gap-4 h-auto"
            key={index}
          >
            <NotebookIcon className="size-6 text-primary" />
            <Skeleton className="h-5.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
