# PsyPick（舊 repo，只作轉址與 inbox 存檔）

知心選 PsyPick 已於 2026 年 11 月併入臨床心語 ClinicMind 主站：

**新址：https://clinicmind.github.io/psypick/**

資料正本在主站 repo `clinicmind/clinicmind.github.io` 的 `psypick/data/`。日常巡查與上架一律推送主站；本 repo 的 `site/data/` 已凍結並移除，不要再推送任何資料到這裡。

本 repo 現時用途只有兩個：

1. **轉址**：`site/` 只保留轉址頁（`index.html` 與 `brand/`）。Cloudflare Workers Builds 連接這個 repo，每次推送到 main 就以 `npx wrangler deploy` 部署 `site/` 到 https://psypick.clinicmind-inquire.workers.dev/ 。訪客打開舊網址會自動轉送新站相同路由（包括 `#/case/<slug>`、`#/figures` 等 hash 路由）。舊網址按計劃至少保留轉址 12 個月（至 2027 年 11 月）。
2. **inbox 存檔**：巡查紀錄 JSON 推送到 `muse-inbox` 分支的 `inbox/` 目錄，只作存檔。

後台資料庫、金鑰、上傳檔不放在這裡。
