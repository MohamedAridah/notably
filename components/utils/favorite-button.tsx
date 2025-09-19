"use client";

import React from "react";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import IconMenu from "./icon-menu";

type FavoriteButtonProps = {
  isFavorite: boolean;
  id: string;
  withText?: boolean;
  onToggle: (
    id: string,
    newValue: boolean
  ) => Promise<{ message: string; success: boolean }>;
  iconStyles?: string;
  className?: string;
};

const FavoriteButton = React.memo(
  ({
    isFavorite,
    id,
    withText,
    onToggle,
    iconStyles,
    className,
  }: FavoriteButtonProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [localFavorite, setLocalFavorite] = React.useState(isFavorite); // Optimistic toggle
    const label = localFavorite ? "Remove from favorites" : "Add to favorites";

    React.useEffect(() => {
      setLocalFavorite(isFavorite);
    }, [isFavorite]);

    const handleToggle = React.useCallback(async () => {
      if (isLoading) return;

      setLocalFavorite((prev) => !prev);
      setIsLoading(true);

      try {
        const { success, message } = await onToggle(id, !localFavorite);
        if (success) {
          toast.success(message);
        } else {
          setLocalFavorite((prev) => !prev);
          toast.error(message);
        }
      } catch (err) {
        setLocalFavorite((prev) => !prev);
        toast.error("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }, [id, onToggle, localFavorite, isLoading]);

    if (withText) {
      return (
        <IconMenu
          onClick={handleToggle}
          aria-label={label}
          icon={
            <FavoriteButtonIcon
              isFavorite={localFavorite}
              className={iconStyles}
            />
          }
          text={label}
        />
      );
    }

    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        aria-pressed={localFavorite}
        aria-label={label}
        className={cn(
          "hover:cursor-pointer disabled:opacity-70 transition-transform duration-100 hover:scale-105 active:scale-90",
          className
        )}
      >
        <FavoriteButtonIcon isFavorite={localFavorite} className={iconStyles} />
      </button>
    );
  }
);

FavoriteButton.displayName = "FavoriteButton";
export default FavoriteButton;

export const FavoriteButtonIcon = React.memo(
  ({ isFavorite, className }: { isFavorite: boolean; className?: string }) => {
    const styles = isFavorite ? "fill-yellow-500 text-yellow-500" : "";
    return <StarIcon className={cn("size-4", styles, className)} />;
  }
);

FavoriteButtonIcon.displayName = "FavoriteButtonIcon";
