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
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {title}
        </h1>
        <div className="mt-5 max-w-2xl text-base leading-8 text-white/75">
          {children}
        </div>
      </div>
    </header>
  );
}
