export type HymnEdition = "english" | "efik";
export interface HymnEntry {
  id: string;
  number: string;
  title: string;
  text?: string;
  page?: number;
}
export interface HymnCollection {
  hymns: HymnEntry[];
  pages?: number;
}

export function normalizeHymnSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/ŋ/g, "ng")
    .replace(/[’'.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchHymns(hymns: HymnEntry[], query: string) {
  const value = normalizeHymnSearch(query);
  if (!value) return hymns;
  const number = value.match(/^(?:h(?:ymn)?\s*)?(\d+[ab]?)$/)?.[1];
  if (number) {
    const exact = hymns.filter((hymn) => hymn.number.toLowerCase() === number);
    return exact.length
      ? exact
      : hymns.filter(
          (hymn) =>
            hymn.number.toLowerCase().startsWith(number) &&
            /[ab]$/i.test(hymn.number),
        );
  }
  return hymns.filter((hymn) =>
    normalizeHymnSearch(`${hymn.title}\n${hymn.text ?? ""}`).includes(value),
  );
}
