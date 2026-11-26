"""Rebuild the reading indexes from the church-supplied files. Requires PyMuPDF.

Keep the originals unchanged. Do not infer missing hymn numbers or correct lyrics.
"""
from pathlib import Path
import json
import re
import pymupdf

ROOT = Path(__file__).resolve().parents[1] / "public" / "hymns"


def write_json(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


def efik_hymns():
    source = (ROOT / "efik-hymn-book.txt").read_text(encoding="utf-8-sig").lstrip("\ufeff")
    lines = source.splitlines()
    markers = []
    for i, line in enumerate(lines):
        bare = re.fullmatch(r"\s*(\d{1,3}[aAbB]?)(?:\s+(?:AKPA|UDIANA))?\s*", line)
        titled = re.fullmatch(r"\s*(\d{1,3})\.\s+(.+)", line)
        if bare:
            markers.append((i, bare[1].upper(), ""))
        elif titled and int(titled[1]) > 20:
            next_lines = [part.strip() for part in lines[i+1:i+4] if part.strip()]
            repeated = bool(next_lines and re.fullmatch(re.escape(titled[1]) + r"\.?", next_lines[0]))
            separated = i >= 3 and all(not part.strip() for part in lines[i-3:i])
            if repeated or separated:
                markers.append((i, titled[1], titled[2].strip()))
    # Some headings contain a title line followed by the same standalone number.
    merged = []
    for marker in markers:
        if merged and marker[1] == merged[-1][1] and all(not line.strip() for line in lines[merged[-1][0]+1:marker[0]]):
            previous = merged.pop()
            merged.append((previous[0], marker[1], previous[2] or marker[2]))
        else:
            merged.append(marker)
    hymns, seen = [], set()
    for i, (start, number, title) in enumerate(merged):
        end = merged[i+1][0] if i+1 < len(merged) else len(lines)
        body = [line.strip() for line in lines[start+1:end]]
        while body and not body[0]:
            body.pop(0)
        while body and not body[-1]:
            body.pop()
        # Repeated numeric labels are headings, rather than lyric stanzas.
        if title:
            repeated_labels = {number, number + ".", "I" + number[1:] if number.startswith("1") else number}
            while body and (not body[0] or body[0] in repeated_labels):
                body.pop(0)
        nonempty = [line for line in body if line]
        if not title and len(nonempty) > 1 and not re.match(r"^\d+[.)]", nonempty[0]) and re.match(r"^1[.)]", nonempty[1]):
            title = body.pop(0)
        if not title:
            title = re.sub(r"^1[.)]?\s+", "", nonempty[0]) if nonempty else f"Hymn {number}"
        # Collapse excessive blank lines, preserving every lyric line and stanza.
        content = re.sub(r"\n{3,}", "\n\n", "\n".join(body)).strip()
        signature = (number, re.sub(r"\s+", " ", content))
        if content and signature not in seen:
            seen.add(signature)
            hymns.append({"id": f"efik-{number}-{len(hymns)}", "number": number, "title": title, "text": content})
    return hymns


def english_index():
    entries = []
    with pymupdf.open(ROOT / "methodist-984-hymns.pdf") as book:
        for page_number, page in enumerate(book, 1):
            text = page.get_text()
            # The source uses both H31 and spaced labels such as H 3 1.
            for match in re.finditer(r"^[ \t]*H[ \t]*((?:\d[ \t]*){1,3})[.]?[ \t]*$", text, re.M):
                number = re.sub(r"\s", "", match[1])
                following = text[match.end():].lstrip().splitlines()
                opening_lines = [re.sub(r"^1[ .]+", "", line).strip() for line in following[:6]]
                title = next((line for line in opening_lines if line), f"Hymn {number}")
                entries.append({"id": f"english-{number}-{page_number}-{len(entries)}", "number": number, "title": title, "page": page_number})
        return {"pages": len(book), "hymns": entries}


if __name__ == "__main__":
    efik = efik_hymns()
    english = english_index()
    write_json("efik.json", efik)
    write_json("english-index.json", english)
    print(f"Prepared {len(efik)} distinct Efik entries and {len(english['hymns'])} labelled English entries across {english['pages']} pages.")
