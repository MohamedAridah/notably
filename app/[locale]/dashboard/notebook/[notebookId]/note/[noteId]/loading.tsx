import BreadCrumbSkeleton from "@/components/(skeletons)/breadcrumb";
import DetailsSkeleton from "@/components/(skeletons)/details";
import EditorSkeleton from "@/components/(skeletons)/exitor";

export default function Loading() {
  return (
    <>
      <BreadCrumbSkeleton length={3} />
      <DetailsSkeleton />
      <EditorSkeleton />
    </>
  );
}
