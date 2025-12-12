"use server";

import { NotebookWithCountAndNotes } from "@/types/types";

export const classifyNotebooks = async (
  notebooks: NotebookWithCountAndNotes[]
) => {
  if (!Array.isArray(notebooks)) return { favorites: [], others: [] };

  const favorites = [];
  const others = [];

  for (const notebook of notebooks) {
    if (notebook.isFavorite === true) {
      favorites.push(notebook);
    } else {
      others.push(notebook);
    }
  }

  return { favorites, others };
};
