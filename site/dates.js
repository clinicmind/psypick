/* 日期工具：活動狀態與倒數的唯一計算處。
 * 一律以港澳日曆日期（Asia/Macau，UTC+8，無夏令時間）在瀏覽當日計算；
 * 只有日期（YYYY-MM-DD）的活動按日曆日處理，不補開始時刻。 */
(function (root) {
  var DAY = 86400000;
  var ISO = /^\d{4}-\d{2}-\d{2}$/;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // 回傳 now 在港澳（UTC+8）的日曆日期 YYYY-MM-DD。
  function todayMacau(now) {
    var d = new Date((now ? new Date(now) : new Date()).getTime() + 8 * 3600000);
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }

  function valid(s) {
    if (typeof s !== "string" || !ISO.test(s)) return false;
    var d = new Date(s + "T00:00:00Z");
    return !isNaN(d) && d.toISOString().slice(0, 10) === s;
  }

  // 兩個日曆日期相差的整數日數（b - a）；任一不是有效日期則回傳 null。
  function dayDiff(a, b) {
    if (!valid(a) || !valid(b)) return null;
    return Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / DAY);
  }

  // 活動狀態："upcoming"｜"ongoing"｜"ended"｜"unknown"（開始日缺失或無效）。
  // end 缺失時視為單日活動。
  function eventStatus(start, end, today) {
    if (!valid(start) || !valid(today)) return "unknown";
    var last = valid(end) ? end : start;
    if (last < start) last = start;
    if (last < today) return "ended";
    if (start <= today) return "ongoing";
    return "upcoming";
  }

  var api = { todayMacau: todayMacau, dayDiff: dayDiff, eventStatus: eventStatus, valid: valid };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PsyDates = api;
})(typeof self !== "undefined" ? self : this);
