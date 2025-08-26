import BreadCrumbSkeleton from "@/components/(skeletons)/breadcrumb";
import CardSkeleton from "@/components/(skeletons)/card";
import DetailsSkeleton from "@/components/(skeletons)/details";
import EditorSkeleton from "@/components/(skeletons)/exitor";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletons = new Array(4).fill(0);

  return (
    <>
      <BreadCrumbSkeleton />
      <DetailsSkeleton />
      <div className="mb-7"></div>
      <Skeleton className="h-5 w-[200px]" />
      <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
        {skeletons.map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
