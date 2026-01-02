// export type NoteCardMode = "default" | "trash" | "archive";
export type NoteCardMode = "default" | "trash";

export const NoteModePolicies = {
  default: {
    canFavorite: true,
    favoriteInteractive: true,
    canEdit: true,
    canView: true,
    canOptions: true,
    canCreate: true,
    canRestore: false,
    canDuplicate: true,
    canCopyLink: true,
    deleteAction: "move-to-trash" as const,
  },
  trash: {
    canFavorite: true,
    favoriteInteractive: false,
    canEdit: false,
    canView: false,
    canOptions: false,
    canCreate: false,
    canRestore: true,
    canDuplicate: false,
    canCopyLink: false,
    deleteAction: "delete-permanently" as const,
  },
  // archive: {
  //   canFavorite: false,
  //   favoriteInteractive: false,
  //   canEdit: false,
  //   canView: true,
  //   canOptions: true,
  //   deleteAction: "move-to-archive" as const,
  // },
} satisfies Record<NoteCardMode, any>;

export type NotePolicy = (typeof NoteModePolicies)[NoteCardMode];
