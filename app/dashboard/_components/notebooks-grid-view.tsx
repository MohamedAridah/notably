import Notebook, { NotebookWithCount } from "@/components/(notebooks)/notebook";

const GridView = ({ notebooks }: { notebooks: NotebookWithCount[] }) => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4 mb-10">
      {notebooks?.map((notebook) => (
        <Notebook key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
};

export default GridView;
