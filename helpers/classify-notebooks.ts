"use server";

import { Notebook } from "@prisma/client";

export const classifyNotebooks = async (notebooks: Partial<Notebook>[]) => {
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
