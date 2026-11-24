export function parseStreamUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return null;
    const host = url.hostname.replace(/^(www|m)\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;
    if (["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)) {
      let id = host === "youtu.be" ? parts[0] : "";
      if (parts[0] === "watch") id = url.searchParams.get("v") ?? "";
      if (["live", "embed", "shorts", "v"].includes(parts[0]))
        id = parts[1] ?? "";
      const isVideo = /^[\w-]{11}$/.test(id);
      const isChannel =
        host === "youtube.com" &&
        (parts[0].startsWith("@") ||
          (["channel", "c", "user"].includes(parts[0]) && Boolean(parts[1])));
      if (!isVideo && !isChannel) return null;
      return {
        watchUrl: url.toString(),
        embedUrl: isVideo ? `https://www.youtube-nocookie.com/embed/${id}` : "",
        provider: "YouTube",
      };
    }
    if (["facebook.com", "fb.watch"].includes(host)) {
      const isVideo =
        host === "fb.watch" ||
        parts.some((part) =>
          ["videos", "video", "watch", "reel", "reels"].includes(part),
        ) ||
        (parts[0] === "share" && parts[1] === "v");
      const embed = new URL("https://www.facebook.com/plugins/video.php");
      embed.searchParams.set("href", url.toString());
      embed.searchParams.set("show_text", "false");
      return {
        watchUrl: url.toString(),
        embedUrl: isVideo ? embed.toString() : "",
        provider: "Facebook",
      };
    }
  } catch {
    /* Invalid links never become iframe sources. */
  }
  return null;
}

export const prayerCategories = [
  "General",
  "Family",
  "Health",
  "Guidance",
  "Thanksgiving",
] as const;
export const prayerStatuses = {
  received: "Received",
  praying: "In prayer",
  prayed_for: "Prayed for",
} as const;
export type PrayerStatus = keyof typeof prayerStatuses;
