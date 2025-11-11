"use client";

import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { NotebookWithCount } from "@/components/(notebooks)/notebook";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, { DEFAULT_VIEW } from "./view-controller";
import GridView from "./notebooks-grid-view";
const DetailsView = dynamic(() => import("./notebooks-details-view"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});

type NotebooksProps = {
  notebooks: {
    notebook__favorites: NotebookWithCount[];
    notebook__others: NotebookWithCount[];
  };
};

const Notebooks = ({ notebooks }: NotebooksProps) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });

  return (
    <>
      <ViewController />
      {view == "grid" && (
        <>
          {notebooks.notebook__favorites.length > 0 ? (
            <div className="mb-5">
              <h2 className="font-thin uppercase mb-3 tracking-wider ">
                Favorites
              </h2>
              <GridView notebooks={notebooks.notebook__favorites} />
            </div>
          ) : null}

          {notebooks.notebook__others.length > 0 ? (
            <div className="mb-5">
              <h2 className="font-thin uppercase mb-3 tracking-wider">
                Others
              </h2>
              <GridView notebooks={notebooks.notebook__others} />
            </div>
          ) : null}
        </>
      )}
      {view == "rows" && (
        <>
          {notebooks.notebook__favorites ? (
            <div className="mb-5">
              <h2 className="font-thin uppercase mb-3 tracking-wider">
                Favorites
              </h2>
              <DetailsView
                notebooks={notebooks.notebook__favorites as NotebookWithCount[]}
              />
            </div>
          ) : null}

          {notebooks.notebook__others ? (
            <div className="mb-5">
              <h2 className="font-thin uppercase mb-3 tracking-wider">
                Others
              </h2>
              <DetailsView
                notebooks={notebooks.notebook__others as NotebookWithCount[]}
              />
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Notebooks;
