import { HeroHeader } from "@/components/header";
import { HomeIcon } from "lucide-react";

export default function SettingsHeader() {
  return (
    <HeroHeader
      menuLinks={[{ href: "/", label: "home", icon: <HomeIcon /> }]}
      className="static bg-background backdrop-blur-none"
    />
  );
}
