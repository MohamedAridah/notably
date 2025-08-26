import CardSkeleton from "@/components/(skeletons)/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletons = new Array(4).fill(0);
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-4 w-[110px]" />
        <Skeleton className="h-8 w-[110px]" />
      </div>

      <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
        {skeletons.map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
