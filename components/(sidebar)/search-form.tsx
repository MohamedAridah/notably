"use client";

import { useQueryState } from "nuqs";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search your notes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          {search && (
            <X
              className="absolute top-1/2 right-2 size-4 -translate-y-1/2 opacity-50 cursor-pointer"
              onClick={() => setSearch("")}
              aria-label="clear search input"
            />
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
