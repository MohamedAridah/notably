import { Note, Notebook } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/format-date";
import { getLocale, getTranslations } from "next-intl/server";

type DocumentDetailsProps = {
  document: Notebook | Note;
};

export default async function DocumentDetails({
  document,
  ...props
}: DocumentDetailsProps & React.ComponentProps<"div">) {
  const locale = await getLocale();
  const t = await getTranslations("Common.terms");
  return (
    <div className={cn("flex flex-col gap-2 mt-2", props.className)}>
      <p className="text-sm">
        {t("createdAt")}{" "}
        <span>
          {formatDate({
            date: document.createdAt,
            locale,
          })}
        </span>
      </p>
      <p className="text-sm">
        {t("updatedAt")}{" "}
        <span>
          {formatDate({
            date: document.updatedAt,
            locale,
          })}
        </span>
      </p>
    </div>
  );
}
