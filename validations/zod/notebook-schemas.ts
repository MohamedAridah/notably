import z from "zod";
import { message } from "./auth-schemas";

export const NotebookSchema = z.object({
  name: z.string().min(1, message("emptyNotebook", {})).trim(),
  redirectTo: z.boolean(),
});
