export const sitePaths = {
  home: "/",
  about: "/about",
  leadership: "/leadership",
  gallery: "/gallery",
  giving: "/giving",
  admin: "/admin",
  live: "/live",
  prayer: "/prayer",
  members: "/members",
  hymns: "/hymns",
} as const;

export type SitePage = keyof typeof sitePaths;
