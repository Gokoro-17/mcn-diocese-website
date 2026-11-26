import type { ReactNode } from "react";

export default function CommunityIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="community-intro">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="site-eyebrow">{eyebrow}</p>
        <h1 className="page-heading">{title}</h1>
        <div className="community-intro-copy mt-5 max-w-2xl text-lg leading-8">
          {children}
        </div>
      </div>
    </header>
  );
}
