import assert from "node:assert/strict";
import test from "node:test";
import { parseStreamUrl } from "../src/lib/livestream.ts";

test("official YouTube video URLs become privacy-enhanced embeds", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=AbCdEf012_-",
    "https://youtu.be/AbCdEf012_-?si=shared",
    "https://www.youtube.com/live/AbCdEf012_-",
    "https://www.youtube-nocookie.com/embed/AbCdEf012_-",
  ])
    assert.equal(
      parseStreamUrl(url)?.embedUrl,
      "https://www.youtube-nocookie.com/embed/AbCdEf012_-",
    );
});

test("channel and Facebook page links stay external, while public video links embed", () => {
  assert.equal(
    parseStreamUrl("https://www.youtube.com/@church/live")?.embedUrl,
    "",
  );
  assert.equal(
    parseStreamUrl("https://www.youtube.com/channel/UCexample/live")?.provider,
    "YouTube",
  );
  assert.equal(
    parseStreamUrl("https://www.facebook.com/examplechurch")?.embedUrl,
    "",
  );
  const video = "https://www.facebook.com/examplechurch/videos/123456789";
  assert.equal(
    new URL(parseStreamUrl(video).embedUrl).searchParams.get("href"),
    video,
  );
});

test("untrusted hosts, credentials, executable schemes, and malformed links are rejected", () => {
  for (const url of [
    "",
    "not a url",
    "javascript:alert(1)",
    "data:text/html,test",
    "http://youtube.com/watch?v=AbCdEf012_-",
    "https://youtube.com.evil.test/watch?v=AbCdEf012_-",
    "https://evil.test/youtube.com/watch?v=AbCdEf012_-",
    "https://user:password@youtube.com/watch?v=AbCdEf012_-",
    "https://youtube.com:8443/watch?v=AbCdEf012_-",
    "https://youtube.com/watch?v=invalid",
    "https://youtube.com/",
    "https://fb.watch/",
  ])
    assert.equal(parseStreamUrl(url), null, url);
});
