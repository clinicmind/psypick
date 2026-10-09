// node --test tests/   （僅用合成日期，無任何個人或個案資料）
const test = require("node:test");
const assert = require("node:assert");
const D = require("../site/dates.js");

test("todayMacau 以 UTC+8 取日曆日，跨午夜正確", () => {
  assert.strictEqual(D.todayMacau("2026-10-08T15:59:59Z"), "2026-10-08");
  assert.strictEqual(D.todayMacau("2026-10-08T16:00:00Z"), "2026-10-09");
  assert.strictEqual(D.todayMacau("2026-12-31T16:30:00Z"), "2027-01-01");
});

test("固定測試日 2026-10-09：已結束的會議不再是進行中／即將開始", () => {
  const today = "2026-10-09";
  assert.strictEqual(D.eventStatus("2026-10-02", "2026-10-06", today), "ended"); // WAIMH 頁面日期
  assert.strictEqual(D.eventStatus("2026-10-05", "2026-10-05", today), "ended");
  assert.strictEqual(D.eventStatus("2026-10-07", "2026-10-07", today), "ended");
  assert.strictEqual(D.eventStatus("2026-10-16", "2026-10-18", today), "upcoming");
});

test("倒數按日曆日相差：10/31 距 10/09 為 22 天", () => {
  assert.strictEqual(D.dayDiff("2026-10-09", "2026-10-31"), 22);
  assert.strictEqual(D.dayDiff("2026-10-09", "2026-10-09"), 0);
  assert.strictEqual(D.dayDiff("2026-10-09", "2026-10-08"), -1);
});

test("多日活動：開始日、結束日當天都是進行中", () => {
  assert.strictEqual(D.eventStatus("2026-10-09", "2026-10-11", "2026-10-09"), "ongoing");
  assert.strictEqual(D.eventStatus("2026-10-09", "2026-10-11", "2026-10-11"), "ongoing");
  assert.strictEqual(D.eventStatus("2026-10-09", "2026-10-11", "2026-10-12"), "ended");
});

test("缺結束日視為單日；缺開始日或無效日期為 unknown，不補值", () => {
  assert.strictEqual(D.eventStatus("2026-10-09", "", "2026-10-09"), "ongoing");
  assert.strictEqual(D.eventStatus("2026-10-09", undefined, "2026-10-10"), "ended");
  assert.strictEqual(D.eventStatus("", "2026-10-11", "2026-10-09"), "unknown");
  assert.strictEqual(D.eventStatus("隨選", "", "2026-10-09"), "unknown");
  assert.strictEqual(D.eventStatus("2026-02-30", "", "2026-10-09"), "unknown");
  assert.strictEqual(D.dayDiff("Expires on Dec 26", "2026-10-09"), null);
});

test("跨年與閏日", () => {
  assert.strictEqual(D.dayDiff("2027-12-31", "2028-03-01"), 61);
  assert.strictEqual(D.valid("2028-02-29"), true);
  assert.strictEqual(D.valid("2027-02-29"), false);
});

test("無夏令時間影響：同一 UTC 時刻無論 TZ 環境變數都得同一港澳日期", () => {
  const prev = process.env.TZ;
  try {
    for (const tz of ["UTC", "America/New_York", "Europe/London"]) {
      process.env.TZ = tz;
      assert.strictEqual(D.todayMacau("2026-03-29T17:00:00Z"), "2026-03-30");
    }
  } finally { process.env.TZ = prev; }
});
