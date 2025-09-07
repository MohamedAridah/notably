import { Skeleton } from "@/components/ui/skeleton";

export default function DetailsSkeleton() {
  return (
    <>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-[110px]" />
        <Skeleton className="h-8 w-[90px]" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[190px]" />
        <Skeleton className="h-4 w-[220px]" />
      </div>
    </>
  );
}
