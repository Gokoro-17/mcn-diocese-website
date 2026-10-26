import assert from "node:assert/strict";
import test from "node:test";
import { whatsappContactLink } from "../src/lib/whatsapp.ts";

test("Nigerian local numbers open a phone contact with the country code", () => {
  for (const number of [
    "07030793088",
    "0703 079 3088",
    "(0703) 079-3088",
    "7030793088",
    "+234 703 079 3088",
    "2347030793088",
    "002347030793088",
    "+234 (0) 703 079 3088",
    "  07030793088  ",
  ]) {
    assert.equal(whatsappContactLink(number), "https://wa.me/2347030793088", number);
  }
});

test("existing WhatsApp phone links also normalize local numbers", () => {
  for (const link of [
    "https://wa.me/07030793088",
    "wa.me/07030793088",
    "https://wa.me/07030793088/",
    "https://wa.me/%2B234%20703%20079%203088",
    "https://api.whatsapp.com/send?phone=07030793088",
    "https://web.whatsapp.com/send/?phone=%2B2347030793088",
  ]) {
    assert.equal(new URL(whatsappContactLink(link)).pathname, "/2347030793088", link);
  }
});

test("international country codes are preserved", () => {
  assert.equal(whatsappContactLink("+44 7700 900123"), "https://wa.me/447700900123");
  assert.equal(whatsappContactLink("0044 7700 900123"), "https://wa.me/447700900123");
  assert.equal(whatsappContactLink("+1 (202) 555-0123"), "https://wa.me/12025550123");
});

test("ministry messages survive URL encoding and replace old prefilled text", () => {
  const message = "Hello, I'd like to join the Children's Ministry & meet its leader.";
  const link = new URL(whatsappContactLink("https://wa.me/07030793088?text=Old", message));
  assert.equal(link.pathname, "/2347030793088");
  assert.equal(link.searchParams.get("text"), message);
});

test("official business and group links remain usable", () => {
  assert.equal(whatsappContactLink("https://wa.me/message/ABC123"), "https://wa.me/message/ABC123");
  assert.equal(whatsappContactLink("https://chat.whatsapp.com/ABC123"), "https://chat.whatsapp.com/ABC123");
});

test("empty or malformed contacts do not produce a broken contact button", () => {
  for (const value of [
    "", " ", "Optional", "0703", "@07030793088", "07030793088abc", "00000000000",
    "1234567890123456", "https://wa.me/", "https://wa.me/0703",
    "https://api.whatsapp.com/send", "https://example.com/07030793088",
    "https://wa.me.example.com/07030793088", "https://user@wa.me/07030793088",
    "javascript:alert(1)",
  ]) {
    assert.equal(whatsappContactLink(value), "", value);
  }
});
