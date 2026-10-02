# PsyPick 網站（靜態）
`site/` 是要上線的網站。Cloudflare Workers Builds 連接這個 repo，每次推送到 main 就以 `npx wrangler deploy` 部署 `site/`。
內容更新由 Claude 驗證後提交；後台資料庫、金鑰、上傳檔不放在這裡。
