const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** Sunday 7:00 AM in Calabar (WAT, UTC+1), independent of visitor timezone. */
export function nextSundayService(now = Date.now()) {
  const local = new Date(now + HOUR);
  const daysUntilSunday = (7 - local.getUTCDay()) % 7;
  let target = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() + daysUntilSunday,
    6,
  );
  if (target <= now) target += 7 * DAY;
  return target;
}

export function sundayCountdown(now = Date.now()) {
  const seconds = Math.max(0, Math.ceil((nextSundayService(now) - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}
