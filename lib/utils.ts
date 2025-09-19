import { setNotebookFavorite } from "@/server/notebooks";
import { setNoteFavorite } from "@/server/notes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleToggleFavorite_Notebook = async (
  id: string,
  currentValue: boolean
) => await setNotebookFavorite(id, currentValue);

export const handleToggleFavorite_Note = async (
  id: string,
  currentValue: boolean
) => await setNoteFavorite(id, currentValue);
