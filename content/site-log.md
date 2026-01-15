---
title: ⚙️ 網站設置 LOG
description: Still Whispers 網站優化與待辦清單
---
---
## 🪵 建立宗旨
紀錄「靜觀微語」數位圖書館的建置過程、技術參數與結構更動。

---

> [!abstract]- 📅 2026-01-15 | 側邊欄秩序、路徑修復與在地化
> - **🧩 側邊欄視覺革命 (UI Refinement)**
>     - **自動標題前綴**：於 `quartz.layout.ts` 注入 `mapFn` 邏輯，自動為檔案標題補上「・」，消除散亂感。
>     - **Emoji 全站統一**：修正「👤 關於我」與「⚙️ 網站設置 LOG」的圖示，讓導覽列呈現系統化視覺。
> - **🔗 路徑與 404 修復 (Link Fix)**
>     - **Footer 重構**：修正底部「建構日誌」連結路徑，從子資料夾導回根目錄，確保跳轉正確。
> - **💻 本機開發環境搭建 (Local Development)**
>     - **VS Code 導入**：正式捨棄純網頁編輯，改採 VS Code 編輯 `quartz.layout.ts`。
>     - **環境偵錯**：安裝 Node.js LTS 與 Prettier 插件，確保代碼格式嚴謹。
>     - **目前瓶頸**：本地 Server (`npx quartz build --serve`) 依賴安裝中，準備實現即時預覽。

> [!abstract]- 📅 2026-01-14 | 系統重構、數據追蹤與核心入庫
> - **📊 流量統計佈署**：完成 GoatCounter 雙重植入（Head & Footer）。
> - **🏺 視覺識別**：確立側邊欄標題為 `🏺 全站導覽`。
> - **📚 核心藏書入庫**：建立《陶藝講座-邱煥堂》、《柴燒-陳威恩》與《陶藝科學》三本基礎架構。
> - **💬 評論系統**：掛載 Giscus，串接 GitHub Discussions。

> [!abstract]- 📅 2026-01-13 | 風格確立與版面調校
> - **🎨 風格設定**：預設深色模式 (Dark Mode)，符合職人沉靜調性。
> - **🛠️ 組件配置**：加入 Search、Darkmode 與讀者互動組件。

> [!abstract]- 📅 2026-01-12 | 破土動工：環境部署
> - **🚀 技術選型**：採用 Quartz 4.0 引擎。
> - **📦 儲存同步**：使用 GitHub 與 GitHub Desktop 進行版本管理。
> - **📈 SEO 基礎**：配置 Google Search Console。

---

### 🛠️ 技術堆疊 (Technical Stack)

| 類別 | 項目 | 備註 |
| :--- | :--- | :--- |
| **Engine** | [Quartz 4.0](https://quartz.jzhao.xyz/) | SPA 模式 |
| **Editor** | **Obsidian / VS Code** | 支援雙向連結與 Prettier 格式化 |
| **Storage** | **GitHub** | 搭配 GitHub Desktop 管理 |
| **Comments** | **Giscus** | GitHub Discussions 後端 |
| **Analytics** | **GoatCounter** | 雙重 (Head & Footer) 佈署 |

---

### 💡 更新守則
每次進行技術更動或大規模內容更新時，請於最上方新增一個 `[!abstract]-` 區塊，確保「靜觀微語」的成長軌跡清晰可尋。