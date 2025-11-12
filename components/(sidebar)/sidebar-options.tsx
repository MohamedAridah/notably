const SidebarOptions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group-data-[collapsible=icon]:hidden flex gap-[1px] justify-end -mt-2">
      {children}
    </div>
  );
};

export default SidebarOptions;
