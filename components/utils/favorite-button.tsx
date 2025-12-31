"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import IconMenu from "@/components/utils/icon-menu";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type FavoriteButtonProps = {
  id: string;
  isFavorite: boolean;
  onToggle: (
    id: string,
    newValue: boolean
  ) => Promise<{
    code: string;
    success: boolean;
    manualCode?: true;
    type?: string;
  }>;
  withText?: boolean;
  iconStyles?: string;
  className?: string;
  disabled?: boolean;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  isFavorite,
  onToggle,
  iconStyles = "",
  className = "",
  withText = false,
  disabled = false,
}) => {
  const t = useTranslations("FavoriteButton");
  const common = useTranslations("Common");
  const tServerCodes = useTranslations("serverCodes");
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
        const { success, code, type, manualCode } = !disabled
          ? await onToggle(id, optimisticValue)
          : {
              success: false,
              code: t("toasts.disabled"),
              manualCode: true,
            };

        if (success) {
          toast.success(tServerCodes(`${type}.${code}`));
        } else {
          setLocalFavorite(!optimisticValue); // Rollback
          toast.error(!manualCode ? tServerCodes(`${type}.${code}`) : code);
        }
      } catch (error) {
        setLocalFavorite(!optimisticValue); // Rollback
        toast.error(common("somethink__went__wrong"));
        console.error("Favorite toggle error:", error);
      }
    });
  }, [id, localFavorite, onToggle]);

  const labelText = localFavorite ? t("labels.remove") : t("labels.add");

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
