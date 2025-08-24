import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 160 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground h-8 w-auto", className)}
    >
      <g>
        <circle cx="20" cy="16" r="12" fill="transparent" stroke="none" />
        {/* Stripes: 5 vertical gradient lines inside the circle */}
        <rect
          x="12"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="16"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="20"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="24"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="28"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
      </g>
      <text
        x="38"
        y="24"
        fontFamily="Montserrat, Segoe UI, Arial, Helvetica, sans-serif"
        fontWeight="600"
        fontSize="25"
        letterSpacing=".75"
        fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
      >
        notably
      </text>
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="160"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIcon = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground h-8 w-auto", className)}
    >
      <g>
        <circle cx="20" cy="16" r="12" fill="transparent" stroke="none" />
        <rect
          x="12"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="16"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="20"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="24"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
        <rect
          x="28"
          y="8"
          width="2"
          height="16"
          rx="1"
          fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
        />
      </g>
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="160"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
