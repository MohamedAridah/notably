import z from "zod";

export const NotebookSchema = z.object({
  name: z.string().min(1, "Notebook can not be empty.").trim(),
});
