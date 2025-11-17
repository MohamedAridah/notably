"use client";

import { useQueryState } from "nuqs";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProps {
  placeholder: string;
  query?: string;
}

export function Search({
  placeholder,
  query = "search",
  ...props
}: React.ComponentProps<"div"> & SearchProps) {
  const [search, setSearch] = useQueryState(query, { defaultValue: "" });

  return (
    <div className={cn("relative flex-1 shrink-0", props.className)}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        id="search"
        className={cn("bg-background h-8 w-full shadow-none pl-8")}
        placeholder={placeholder}
        value={search}
        autoComplete="off"
        onChange={(e) => setSearch(e.target.value)}
      />

      <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />

      {search && (
        <X
          className="absolute top-1/2 right-2 size-4 -translate-y-1/2 opacity-50 cursor-pointer"
          onClick={() => setSearch("")}
          aria-label="clear search input"
        />
      )}
    </div>
  );
}
