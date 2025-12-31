export const DEFAULT_CONTENT = (text: string) => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [
          {
            text,
            type: "text",
          },
        ],
      },
    ],
  };
};
