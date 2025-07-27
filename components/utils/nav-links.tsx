import Link from "next/link";

export const menuItems = [
  { name: "Features", path: "#link" },
  { name: "Solution", path: "#link" },
  { name: "Pricing", path: "#link" },
  { name: "About", path: "#link" },
];

type NavLinksProps = {
  className?: string;
};

export default function NavLinks({ className }: NavLinksProps) {
  return (
    <ul className={className}>
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            className="text-muted-foreground hover:text-accent-foreground block duration-150"
          >
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
