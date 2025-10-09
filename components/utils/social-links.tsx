import Link from "next/link";
import { CodepenIcon, FrontendMentorIcon, GithubIcon } from "./social-icons";

interface SocialItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const socialItems: SocialItem[] = [
  {
    name: "Frontend Mentor",
    icon: FrontendMentorIcon,
    path: "https://www.frontendmentor.io/profile/MohamedAridah",
  },
  {
    name: "Codepen",
    icon: CodepenIcon,
    path: "https://codepen.io/FedLover",
  },
  {
    name: "Github",
    icon: GithubIcon,
    path: "https://github.com/MohamedAridah",
  },
];

type SocialLinksProps = {
  className?: string;
};

export default function SocialLinks({ className }: SocialLinksProps) {
  if (socialItems.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {socialItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className="text-muted-foreground fill-muted-foreground hover:text-primary block hover:fill-primary duration-150"
          >
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  );
}
