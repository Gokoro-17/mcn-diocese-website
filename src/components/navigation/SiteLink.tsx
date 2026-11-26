import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { sitePaths, type SitePage } from "../../lib/navigation";

interface SiteLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  page: SitePage;
  onNavigate: (page: string) => void;
}

export default function SiteLink({
  page,
  onNavigate,
  onClick,
  ...props
}: SiteLinkProps) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    )
      return;
    event.preventDefault();
    onNavigate(page);
  }
  return <a {...props} href={sitePaths[page]} onClick={navigate} />;
}
