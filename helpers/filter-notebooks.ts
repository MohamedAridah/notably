"use server";

import { Notebook } from "@prisma/client";

export type NotebookWithFavorite = Notebook;

export type FilteredNotebooks = {
  favorites: NotebookWithFavorite[];
  others: NotebookWithFavorite[];
};

export const filterNotebooks = async (
  notebooks: NotebookWithFavorite[]
): Promise<FilteredNotebooks> => {
  if (!Array.isArray(notebooks)) return { favorites: [], others: [] };

  const favorites: NotebookWithFavorite[] = [];
  const others: NotebookWithFavorite[] = [];

  for (const notebook of notebooks) {
    if (notebook.isFavorite === true) {
      favorites.push(notebook);
    } else {
      others.push(notebook);
    }
  }

  return { favorites, others };
};
