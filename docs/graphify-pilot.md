# Graphify 試點：PsyPick

## 目的與範圍

使用 Graphify 建立程式碼依賴圖，協助 Codex / Claude Code 在修改前定位受影響的函式及檔案。此階段只提供可選的本機操作程序；**不自動安裝、執行或部署任何第三方程式**。

已確認本 Repository 主要程式碼位於 `site/app.js`，介面位於 `site/index.html` 和 `site/style.css`，內容資料位於 `site/data/`。目前尚未成功安裝 Graphify，因此**沒有實際圖譜或節省 token 的測試結果**。

## 前置條件

- Python 3.10 或更新版本；具備 `uv` 或 `pipx`。
- 先審查官方來源及依賴；官方套件為 `graphifyy`（兩個 y）：https://github.com/Graphify-Labs/graphify 。
- 使用可信任的隔離環境，切勿提交金鑰、個案資料、上傳檔案或私有資料。
- 如使用文件語意分析，先確認是否啟用外部模型/API；純程式碼 AST 分析與文件語意分析的資料流不同。

## 人手啟用程序（獲批准後才執行）

```bash
uv tool install graphifyy
# 在已 clone 的 PsyPick 專案根目錄執行
graphify install --project --platform codex
# 然後在 Codex 中呼叫 $graphify 進行分析
```

安裝後先查看 `graphify --help`、`graphify install --help`，核對當前版本指令及將被修改的檔案；**若安裝器打算覆寫現有 AGENTS.md 或其他 Agent 指引，停止並手動合併**。

預期輸出通常為 `graphify-out/graph.html`、`graphify-out/GRAPH_REPORT.md`、`graphify-out/graph.json`。請將輸出留在本機，避免無意提交大型圖譜或敏感檔案。

## 首個可驗證任務

1. 分析 `site/app.js` 與 `site/index.html` 的程式依賴及事件連結。
2. 從圖譜選取一個低風險的 UI 修改點，列出受影響檔案及相關函式。
3. 用原始碼核實圖譜的 `EXTRACTED` 與 `INFERRED` 關係，不把推斷當作事實。
4. 只在獨立分支修改並驗證；禁止直接修改 `site/data/` 內容 JSON、`family.json`、更新包、`knowledge/` 或任何個案資料。
5. 記錄 Graphify 建圖時間、輸出大小、問答準確性、與不使用 Graphify 的比較；**不預設節省 80% token**。

## 角色分工

- ChatGPT：規劃、風險審核、跨專案優先次序及成果摘要。
- Codex：在隔離分支執行工具、核實圖譜、完成小型程式碼變更及測試。
- Claude Code：內容及文件查證；不得未經審核修改 PsyPick 受保護資料。

## 狀態（2026-10-11）

- [x] 確認 PsyPick Repository 與初步目錄結構。
- [x] 建立 Graphify 試點操作說明。
- [ ] 安裝 Graphify（先前工作環境無法連線 PyPI）。
- [ ] 實際產生程式知識圖譜。
- [ ] 進行準確性、時間及 token 成本比較。
- [ ] 審查後再決定是否擴展至 Mental Health Atlas。
