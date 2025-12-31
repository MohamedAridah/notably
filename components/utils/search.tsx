"use client";

import { useQueryState } from "nuqs";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SearchProps {
  placeholder: string;
  query?: string;
  className_input?: string;
}

export function Search({
  placeholder,
  query = "search",
  className_input,
  ...props
}: React.ComponentProps<"div"> & SearchProps) {
  const t = useTranslations("Sidebar.searchForm");
  const [search, setSearch] = useQueryState(query, { defaultValue: "" });

  return (
    <div className={cn("relative flex-1 shrink-0", props.className)}>
      <label htmlFor={props.id || "search"} className="sr-only">
        {t("label")}
      </label>
      <Input
        id={props.id || "search"}
        className={cn(
          "bg-background h-8 w-full shadow-none ps-8",
          className_input
        )}
        placeholder={placeholder}
        value={search}
        autoComplete="off"
        onChange={(e) => setSearch(e.target.value)}
      />

      <SearchIcon className="pointer-events-none absolute top-1/2 start-2 size-4 -translate-y-1/2 opacity-50 select-none" />

      {search && (
        <X
          className="absolute top-1/2 end-2 size-4 -translate-y-1/2 opacity-50 cursor-pointer"
          onClick={() => setSearch("")}
          aria-label={t("clearAriaLabel")}
        />
      )}
    </div>
  );
}
