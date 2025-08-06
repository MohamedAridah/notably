import z from "zod";

export const NoteSchema = z.object({
  title: z.string().min(1, "Note can not be empty."),
  content: z.string().optional(),
});
