import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { searchHymns } from "../src/lib/hymns.ts";

const efik = JSON.parse(
  await readFile(new URL("../public/hymns/efik.json", import.meta.url), "utf8"),
);
const english = JSON.parse(
  await readFile(
    new URL("../public/hymns/english-index.json", import.meta.url),
    "utf8",
  ),
);

test("number searches select the exact hymn, without including 10 or 100 for hymn 1", () => {
  assert.deepEqual(
    searchHymns(efik, "Hymn 1").map((hymn) => hymn.number),
    ["1"],
  );
  assert.deepEqual(
    searchHymns(efik, "16").map((hymn) => hymn.number),
    ["16A", "16B"],
  );
  assert.deepEqual(
    searchHymns(efik, "h16b").map((hymn) => hymn.number),
    ["16B"],
  );
  assert.deepEqual(searchHymns(efik, "146"), []);
});

test("Efik searches handle ng/ŋ, case, punctuation, and phrases inside stanzas", () => {
  const entry = {
    id: "sample",
    number: "1",
    title: "Oboŋ, Andinyaŋa",
    text: "Ke mfon Fo\nNnyin iberedem.",
  };
  assert.deepEqual(searchHymns([entry], "obong andinyanga"), [entry]);
  assert.deepEqual(searchHymns([entry], "MFON FO NNYIN"), [entry]);
  assert.deepEqual(searchHymns([entry], "not present"), []);
});

test("supplied book indexes have unique entries and valid English PDF destinations", () => {
  assert.equal(english.pages, 379);
  assert.equal(efik.length, 365);
  assert.ok(english.hymns.length > 970);
  for (const entries of [efik, english.hymns]) {
    assert.equal(new Set(entries.map((hymn) => hymn.id)).size, entries.length);
    assert.ok(
      entries.every(
        (hymn) => hymn.title.trim() && /^[0-9]+[AB]?$/i.test(hymn.number),
      ),
    );
  }
  assert.equal(new Set(efik.map((hymn) => hymn.number)).size, efik.length);
  assert.ok(
    efik.every((hymn) => hymn.text.trim() && !hymn.text.includes("\ufeff")),
  );
  assert.ok(
    english.hymns.every(
      (hymn) =>
        Number.isInteger(hymn.page) &&
        hymn.page >= 1 &&
        hymn.page <= english.pages,
    ),
  );
  assert.equal(searchHymns(english.hymns, "H984")[0].page, 378);
  assert.match(
    searchHymns(english.hymns, "O FOR a thousand tongues")[0].number,
    /^1$/,
  );
});
