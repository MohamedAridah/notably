import Panel from "@/app/[locale]/(settings)/_components/panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserBioSkeleton({ count }: { count?: number }) {
  const items = new Array(count || 3).fill(0);

  return items.map((_, index) => (
    <Panel key={index}>
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    </Panel>
  ));
}
