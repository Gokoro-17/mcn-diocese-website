import assert from "node:assert/strict";
import test from "node:test";
import {
  nextSundayService,
  sundayCountdown,
} from "../src/lib/serviceCountdown.ts";

test("countdown targets Sunday at 7 AM WAT, rather than the visitor's local timezone", () => {
  const now = Date.parse("2026-11-26T12:00:00+01:00");
  assert.equal(
    new Date(nextSundayService(now)).toISOString(),
    "2026-11-29T06:00:00.000Z",
  );
  assert.deepEqual(sundayCountdown(now), {
    days: 2,
    hours: 19,
    minutes: 0,
    seconds: 0,
  });
  const sameInstant = Date.parse("2026-11-26T03:00:00-08:00");
  assert.equal(nextSundayService(sameInstant), nextSundayService(now));
});

test("Sunday before service counts down to today, then rolls forward at service time", () => {
  const before = Date.parse("2026-11-29T06:59:59+01:00");
  assert.deepEqual(sundayCountdown(before), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1,
  });
  assert.equal(
    new Date(nextSundayService(before + 1000)).toISOString(),
    "2026-12-06T06:00:00.000Z",
  );
  assert.deepEqual(sundayCountdown(before + 1000), {
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(sundayCountdown(before + 2000), {
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
});

test("WAT midnight and the year boundary do not shift the next service date", () => {
  const saturdayUTC = Date.parse("2026-11-28T23:30:00Z");
  assert.equal(
    new Date(nextSundayService(saturdayUTC)).toISOString(),
    "2026-11-29T06:00:00.000Z",
  );
  assert.deepEqual(sundayCountdown(saturdayUTC), {
    days: 0,
    hours: 6,
    minutes: 30,
    seconds: 0,
  });
  assert.equal(
    new Date(
      nextSundayService(Date.parse("2026-12-31T23:30:00Z")),
    ).toISOString(),
    "2027-01-03T06:00:00.000Z",
  );
});
