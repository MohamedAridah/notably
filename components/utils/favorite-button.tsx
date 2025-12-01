"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import IconMenu from "./icon-menu";

type FavoriteButtonProps = {
  id: string;
  isFavorite: boolean;
  onToggle: (
    id: string,
    newValue: boolean
  ) => Promise<{ message: string; success: boolean }>;
  withText?: boolean;
  iconStyles?: string;
  className?: string;
  disabled?: boolean;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  isFavorite,
  onToggle,
  withText = false,
  iconStyles = "",
  className = "",
  disabled = false,
}) => {
  const [isPending, startTransition] = useTransition();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // Sync with prop in case parent updates it
  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggle = useCallback(() => {
    const optimisticValue = !localFavorite;
    setLocalFavorite(optimisticValue);

    startTransition(async () => {
      try {
        const { success, message } = !disabled
          ? await onToggle(id, optimisticValue)
          : {
              success: false,
              message: "Favorite action disabled in this mode. Restore notebook to enable.",
            };

        if (success) {
          toast.success(message);
        } else {
          setLocalFavorite(!optimisticValue); // Rollback
          toast.error(message);
        }
      } catch (error) {
        setLocalFavorite(!optimisticValue); // Rollback
        toast.error("Something went wrong.");
        console.error("Favorite toggle error:", error);
      }
    });
  }, [id, localFavorite, onToggle]);

  const labelText = localFavorite
    ? "Remove from favorites"
    : "Add to favorites";

  const icon = (
    <FavoriteButtonIcon isFavorite={localFavorite} className={iconStyles} />
  );

  if (withText) {
    return (
      <IconMenu
        onClick={handleToggle}
        aria-label={labelText}
        icon={icon}
        text={labelText}
      />
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={localFavorite}
      aria-label={labelText}
      className={cn(
        "hover:cursor-pointer disabled:opacity-70 transition-transform duration-100 hover:scale-105 active:scale-90",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default FavoriteButton;

type FavoriteIconProps = {
  isFavorite: boolean;
  className?: string;
};

export const FavoriteButtonIcon: React.FC<FavoriteIconProps> = ({
  isFavorite,
  className = "",
}) => {
  return (
    <StarIcon
      className={cn(
        "size-4",
        {
          "fill-yellow-500 text-yellow-500": isFavorite,
        },
        className
      )}
    />
  );
};
