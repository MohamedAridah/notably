"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useQueryState } from "nuqs";
import { getNotebooks } from "@/helpers/get-notebooks-client";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import { Search } from "@/components/utils/search";
import { NotebookButton, NotebookButtonProps } from "@/components/(notebooks)/notebook-button";
import { _Translator, useTranslations } from "next-intl";
import { Loader2Icon, ShieldAlertIcon, TriangleAlertIcon } from "lucide-react";

interface NotebooksListProps {
  currentNotebookId: string;
  noteId: string;
  handleClose?: () => void;
}

export type NotebookType = { id: string; name: string };

interface GetNotebooksResponse {
  success: boolean;
  notebooks: NotebookType[];
  code: string;
}

type NotebookDisplayState = {
  isSearching: boolean;
  data: GetNotebooksResponse | NotebookType[];
  isEmpty: boolean;
  resultCount: number;
};

const filterNotebooks = (
  notebooks: { id: string; name: string }[],
  searchTerm: string
): { id: string; name: string }[] => {
  if (!searchTerm.trim()) return notebooks;

  const searchLower = searchTerm.toLowerCase();
  return notebooks.filter((notebook) =>
    notebook.name.toLowerCase().includes(searchLower)
  );
};

const getDisplayState = (
  notebooks: NotebookType[],
  searchTerm: string
): NotebookDisplayState => {
  const isSearching = searchTerm.trim().length > 0;

  if (isSearching) {
    const filteredNotebooks = filterNotebooks(notebooks, searchTerm);
    return {
      isSearching: true,
      data: filteredNotebooks,
      isEmpty: filteredNotebooks.length === 0,
      resultCount: filteredNotebooks.length,
    };
  }

  return {
    isSearching: false,
    data: notebooks,
    isEmpty: notebooks.length === 0,
    resultCount: notebooks.length,
  };
};

const renderContent = (
  displayState: NotebookDisplayState,
  props: Omit<NotebookButtonProps, "notebook" | "notebooks">
): React.ReactNode => {
  if (displayState.isEmpty) {
    return null;
  }

  if (displayState.isSearching) {
    const data = displayState.data as NotebookType[];
    return (
      <div className="w-full grid md:grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 items-start pb-3">
        {data.map((notebook) => (
          <NotebookButton
            key={notebook.id}
            {...props}
            notebook={notebook}
            notebooks={data}
          />
        ))}
      </div>
    );
  }

  const data = displayState.data as NotebookType[];
  return (
    <div className="w-full grid md:grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 items-start pb-3">
      {data.map((notebook) => (
        <NotebookButton
          key={notebook.id}
          {...props}
          notebook={notebook}
          notebooks={data}
        />
      ))}
    </div>
  );
};

const NotebooksList = ({
  noteId,
  currentNotebookId,
  handleClose,
}: NotebooksListProps) => {
  const t = useTranslations("MoveNoteList");
  const tSForm = useTranslations("SearchForm");
  const tCommon = useTranslations("Common.terms");
  const [term] = useQueryState("filter", { defaultValue: "" });
  const [isLoading, startTransition] = useTransition();
  const [notebooks, setNotebooks] = useState<NotebookType[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [isNewNotebookCreated, setIsNewNotebookCreated] = useState<
    boolean | number
  >(false);

  useEffect(() => {
    startTransition(async () => {
      const { success, code, notebooks } = await getNotebooks();
      if (success) {
        setNotebooks(notebooks);
      } else {
        setError(code);
      }
    });
  }, [isNewNotebookCreated]);

  const displayState = useMemo(
    () => getDisplayState(notebooks, term),
    [term, notebooks]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center gap-1 mt-4 py-5">
        <ShieldAlertIcon className="size-5" />
        <span className="text-sm text-muted-foreground">{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-1 mt-4 py-5">
        <Loader2Icon className="size-5 animate-spin" />
        <span className="text-sm text-muted-foreground">
          {t("loadingNotebooks")}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-1">
        {notebooks.length <= 1 && (
          <p className="flex items-center gap-1 text-sm text-orange-500">
            <TriangleAlertIcon className="size-4" /> {t("noEnoughNotebooks")}
          </p>
        )}
        <CreateNotebookDialog
          size="sm"
          className="ms-auto"
          cb={() => setIsNewNotebookCreated((prev) => +prev + 1)}
        />
      </div>

      <div className={`${displayState.isSearching ? "" : "mb-4"}`}>
        <Search
          query="filter"
          id="search-move-note"
          className_input="h-8.5"
          aria-label={tSForm("placeholder.notebooks")}
          placeholder={tSForm("placeholder.notebooks")}
        />
      </div>

      {displayState.isSearching && (
        <p className="mb-4">
          {displayState.isEmpty
            ? tSForm("state.noMatchGeneral")
            : tSForm("state.withMatchMessage", {
                count: displayState.resultCount,
              })}
          <span className="font-bold">&quot;{term}&quot;</span>
        </p>
      )}

      {displayState.isEmpty ? (
        <p className="text-muted-foreground text-center py-8">
          {displayState.isSearching
            ? tSForm("state.noMatchMessage", {
                term: tCommon("notebook", { count: 2 }),
              })
            : tSForm("state.notFoundMessage", {
                term: tCommon("notebook", { count: 2 }),
              })}
        </p>
      ) : (
        renderContent(displayState, {
          noteId,
          currentNotebookId,
          handleClose,
        })
      )}
    </>
  );
};

export default NotebooksList;
