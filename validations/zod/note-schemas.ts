import z from "zod";
import { message } from "./auth-schemas";

export const NoteSchema = z.object({
  title: z.string().min(1, message("emptyNote", {})).trim(),
});
