export const getNotebooks = async (): Promise<{
  success: boolean;
  notebooks: { id: string; name: string }[];
  error: string;
}> => {
  const res = await (await fetch("/api/get-notebooks")).json();
  return res;
};
