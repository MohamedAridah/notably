import { Skeleton } from "../ui/skeleton";

export default function EditorSkeleton() {
  const skeletones = new Array(15).fill(0);
  return (
    <div className="max-w-[900px] mx-auto  flex flex-col gap-10 w-full mt-10">
      <div className="flex items-center gap-2">
        {skeletones.map((_, index) => (
          <Skeleton className="h-7 w-7" key={index} />
        ))}
        <Skeleton className="h-7 w-12 ml-auto" />
      </div>
      <div className="flex flex-col gap-2 h-[300px] w-full">
        <Skeleton className="h-5 w-[220px]" />
        <div className="mb-4"></div>
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[260px]" />
        <div className="mb-4"></div>
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[270px]" />
      </div>
    </div>
  );
}
