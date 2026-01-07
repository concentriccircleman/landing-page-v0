interface IconProps {
  "data-hide": boolean;
  color?: string;
}

export function MenuIcon({ "data-hide": dataHide, color = "#000000", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={`w-8 h-8 absolute text-background top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease ${
        dataHide ? "opacity-0 scale-0" : "opacity-100 scale-100"
      }`}
      {...props}
    >
      <path
        d="M5 14H27M5 18H27"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrossIcon({ "data-hide": dataHide, color = "#000000", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={`w-8 h-8 absolute text-background top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease ${
        dataHide ? "opacity-0 scale-0" : "opacity-100 scale-100"
      }`}
      {...props}
    >
      <path
        d="M8 24L24 8M8 8L24 24"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>
  );
}