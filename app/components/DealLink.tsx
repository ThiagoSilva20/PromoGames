import type { ReactNode } from "react";

type DealLinkProps = {
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

/** Link externo para a loja via redirect CheapShark */
export function DealLink({ href, className, children, ariaLabel }: DealLinkProps) {
  if (!href) {
    return <>{children}</>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
