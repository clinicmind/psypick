#!/usr/bin/env python3
"""資料品質檢查（只用標準庫）：python3 tools/check_data.py
錯誤（ERROR）會令程式以非零狀態結束；警告（WARN）只提示人工確認。
規則來源：PsyPick 臨床 UI/UX 優化規格 §11.4。"""
import glob, json, os, sys
from urllib.parse import urlparse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
ROLES = {"本人文章", "本人貼文", "官方頁面", "訪談", "媒體轉述", "聚合轉載"}
DESIGNS = {"rct", "randomised_experiment", "nonrandomised_controlled", "nonrandomised_comparison", "single_arm", "cohort",
           "cross_sectional", "survey", "qualitative", "scoping_review", "systematic_review", "meta_analysis", "protocol"}


def safe_url(u):
    return urlparse(u or "").scheme in ("http", "https")


def check_case(c):
    out, text = [], " ".join(str(c.get(k, "")) for k in ("title_zh", "title_en", "evidence_note"))
    sd = c.get("study_design")
    if sd is not None:
        if not isinstance(sd, list) or not sd or any(k not in DESIGNS for k in sd):
            out.append(("ERROR", "study_design 必須是非空陣列，且值在已知列舉內：%r" % (sd,)))
            return out
        if "rct" in sd and ("範圍回顧" in text or "scoping" in text.lower()):
            out.append(("ERROR", "範圍回顧被標為 RCT，交人工確認"))
        if "protocol" in sd and any(k in str(c.get("summary_zh", "")) for k in ("已證明", "證實有效", "證明有效")):
            out.append(("WARN", "研究方案含療效結論字眼，請人工審閱"))
    elif c.get("evidence_level") in (3, 4) and ("範圍回顧" in text or "scoping" in text.lower()):
        out.append(("ERROR", "範圍回顧仍以 E%s 顯示，請補 study_design" % c.get("evidence_level")))
    return out


def check_bounty(it):
    out = []
    b = it.get("bounty") or {}
    if b.get("deadline") and "下架" in (it.get("verify_reason") or "") and "留空" not in (it.get("verify_reason") or ""):
        out.append(("ERROR", "招募截止日疑似取自第三方列表下架日，不得作 deadline"))
    return out


def check_figures(f):
    out = []
    for i, u in enumerate(f.get("updates", [])):
        if u.get("source_role") is None:
            out.append(("WARN", "updates[%d] 缺 source_role" % i))
        elif u["source_role"] not in ROLES:
            out.append(("ERROR", "updates[%d] source_role 無效：%r" % (i, u["source_role"])))
        if u.get("url") and not safe_url(u["url"]):
            out.append(("ERROR", "updates[%d] url 協定不安全" % i))
    for p in f.get("people", []):
        for a in p.get("accounts", []):
            if not a.get("url") or a["url"].startswith("#"):
                out.append(("ERROR", "%s 的帳號連結為空或 #" % p.get("slug")))
    return out


def run(site=ROOT):
    problems = []
    load = lambda *p: json.load(open(os.path.join(site, *p), encoding="utf-8"))
    idx = {c["slug"]: c for c in load("data", "index.json")["cases"]}
    for path in sorted(glob.glob(os.path.join(site, "data", "cases", "*.json"))):
        slug = os.path.basename(path)[:-5]
        c = json.load(open(path, encoding="utf-8"))
        for lv, m in check_case(c):
            problems.append((lv, "case %s: %s" % (slug, m)))
        if slug in idx and idx[slug].get("study_design") != c.get("study_design"):
            problems.append(("WARN", "case %s: index.json 與詳情的 study_design 不一致" % slug))
    for it in load("data", "family.json")["items"]:
        if it.get("kind") == "bounty":
            for lv, m in check_bounty(it):
                problems.append((lv, "bounty %s: %s" % (it["slug"], m)))
    for lv, m in check_figures(load("data", "figures.json")):
        problems.append((lv, "figures: " + m))
    return problems


if __name__ == "__main__":
    ps = run()
    for lv, m in ps:
        print(lv, m)
    errs = sum(1 for lv, _ in ps if lv == "ERROR")
    print("%d error(s), %d warning(s)" % (errs, len(ps) - errs))
    sys.exit(1 if errs else 0)
