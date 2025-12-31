import { getCachedNotebooksAction } from "@/server/notebooks";
import { classifyNotebooks } from "@/helpers/classify-notebooks";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import Message from "@/components/utils/message";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Notebooks from "./_components/notebooks";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import { NotebookIcon, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  description:
    "Overview of your notebooks including favorites and other notebooks. Create, view, and manage your notebooks easily from the dashboard.",
};

export default async function Dashboard() {
  const tCommon = await getTranslations("Common");
  const tPages = await getTranslations("Pages");
  const tHLines = await getTranslations("HeadLines");
  const tServerCodes = await getTranslations("serverCodes.NOTEBOOKS");
  const t = await getTranslations("DashboardPage");
  const notebooksResponse = await getCachedNotebooksAction();
  const { success, notebooks, code } = notebooksResponse;

  if (!success) {
    return (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description={
          <>
            <p className="text-lg font-semibold">
              {tServerCodes(code as string)}
            </p>
            <p>{tCommon("something__went__wrong")}</p>
          </>
        }
      />
    );
  }

  const isEmpty = notebooks?.length === 0;
  const { favorites, others } = await classifyNotebooks(notebooks ?? []);

  return (
    <>
      <BreadCrumbUI
        breadCrumbs={[{ label: tPages("dashboard"), href: "/dashboard" }]}
      />

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">{tHLines("notebooks")}</h1>
        <div className="flex items-center gap-2">
          <CreateNoteDialog />
          <CreateNotebookDialog />
        </div>
      </div>

      {isEmpty ? (
        <Message
          Icon={<NotebookIcon className="text-center size-10 mx-auto mb-3" />}
          description={
            <>
              <p className="mb-2">{t("emptyNotebooksMessage")}</p>
              <CreateNotebookDialog variant="outline" />
            </>
          }
        />
      ) : (
        <Notebooks notebooks={{ favorites, others }} />
      )}
    </>
  );
}
