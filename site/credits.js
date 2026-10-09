/* 進修課程的學分狀態：只把明確寫出「學分」的標為有學分；完成證書、CPD、未列者不稱學分。
 * 輸入為 training.ce_credits 原文，輸出為 "yes"｜"extra"｜"none"｜"unknown"。 */
(function (root) {
  function creditStatus(raw) {
    var s = String(raw || "").trim();
    if (!s) return "unknown";
    if (/^(無|否|no|none|無學分)$|頁面未提及|未列|未載明|未確認|待確認|頁面未列/i.test(s)) return "unknown";
    if (/非\s*CE|非學分|CPD|完成證書|不計|非醫師|持續專業發展/i.test(s) && !/\bCEs?\b|\d\s*CE|學分|CE hours/.test(s.replace(/非\s*CE/gi, ""))) return "none";
    if (/另購|另付費|另行申請|另行|須另|需另/.test(s)) return "extra";
    if (/CE|學分|AMA|CEU|繼續教育|積分|credit/i.test(s)) return "yes";
    return "unknown";
  }
  var api = { creditStatus: creditStatus };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PsyCredits = api;
})(typeof self !== "undefined" ? self : this);
