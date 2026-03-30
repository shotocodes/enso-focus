interface Props {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function EnsoLogo({ size = 48, className = "", animate = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Circle ring */}
      <circle
        cx="50"
        cy="50"
        r="32"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        opacity="0.9"
      />
      {/* Center dot - blinks when animated */}
      <circle cx="50" cy="50" r="5" fill="currentColor">
        {animate && (
          <animate
            attributeName="opacity"
            values="1;0.2;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
}
