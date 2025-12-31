import Panel from "../panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserInfoSkeleton({ count = 4 }: { count?: number }) {
  const skeletons = Array(count).fill(null);

  return (
    <Panel>
      <div className="flex flex-col gap-8 overflow-auto">
        {skeletons.map((_, index) => (
          <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Panel>
  );
}
