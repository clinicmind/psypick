// node --test tests/   （合成資料）
const test = require("node:test");
const assert = require("node:assert");
const { creditStatus } = require("../site/credits.js");

test("明確的學分數字為 yes", () => {
  assert.strictEqual(creditStatus("最多 10 個 APA 認可心理師繼續教育學分"), "yes");
  assert.strictEqual(creditStatus("1.5 CEs"), "yes");
});
test("完成證書或 CPD 不稱學分", () => {
  assert.strictEqual(creditStatus("完成證書（非 CE）"), "none");
  assert.strictEqual(creditStatus("CPD 證書（CPD Service）"), "none");
});
test("需另購 CE 為 extra", () => {
  assert.strictEqual(creditStatus("up to 3 CE hours（須另購 CE 升級方案）"), "extra");
});
test("未列或空白為 unknown，不補值", () => {
  assert.strictEqual(creditStatus(""), "unknown");
  assert.strictEqual(creditStatus("無（頁面未提及）"), "unknown");
  assert.strictEqual(creditStatus("低價短課頁面未列 CE"), "unknown");
  assert.strictEqual(creditStatus(undefined), "unknown");
});
