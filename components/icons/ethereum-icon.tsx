import type React from "react"

export function EthereumIcon({ className, size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2L4 12L12 16L20 12L12 2Z" />
      <path d="M4 12L12 22L20 12" />
      <path d="M12 16L12 22" strokeOpacity="0.5" />
    </svg>
  )
}

