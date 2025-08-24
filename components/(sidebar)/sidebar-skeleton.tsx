import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

export default function SidebarSkeleton({
  length,
  showIcon = false,
}: {
  length: number;
  showIcon?: boolean;
}) {
  return (
    <SidebarMenu>
      {Array.from({ length }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon={showIcon} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
