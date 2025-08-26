import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <div className="shadow-2xs rounded-xl border p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-3 w-[70px]" />
      </div>
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-7 w-[75px]" />
        <Skeleton className="h-7 w-[75px]" />
      </div>
    </div>
  );
}
