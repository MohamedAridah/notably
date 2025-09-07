import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeketon({ rows = 4 }: { rows?: number }) {
  const _rows = new Array(rows).fill(0);
  return (
    <>
      <div className="flex justify-between items-center border-b last:border-b-0 hover:bg-muted/50 p-2">
        <Skeleton className="h-5 w-[110px]" />
        <Skeleton className="h-5 w-[120px]" />
        <Skeleton className="h-5 w-[130px]" />
        <Skeleton className="h-5 w-[40px] bg-transparent" />
      </div>

      <div className="flex flex-col">
        {_rows.map((_, index) => (
          <div
            className="flex justify-between items-center border-b last:border-b-0 hover:bg-muted/50 p-2"
            key={index}
          >
            <Skeleton className="h-5 w-[90px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[110px]" />
            <Skeleton className="h-5 w-[40px]" />
          </div>
        ))}
      </div>
    </>
  );
}
