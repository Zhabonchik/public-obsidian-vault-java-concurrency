---
title: "⚙️ 網站設置 LOG"
---

## 🪵 建立宗旨
紀錄「靜觀微語」數位圖書館的建置過程、技術參數與結構更動。

---

> [!abstract]- 📅 2026-01-15 | 開發環境在地化與工具鏈升級
> - **💻 本機開發環境搭建 (Local Development)**
>     - **VS Code 導入**：正式捨棄純網頁編輯，改採 Visual Studio Code 作為核心編輯器，大幅提升對 `quartz.layout.ts` 等結構檔案的管控力。
>     - **插件部署**：安裝 `Prettier - Code formatter` 並開啟 `Format On Save`，確保代碼縮排與語法嚴謹，避免 GitHub Actions 因低級錯誤報錯。
> - **🛠️ 環境偵錯 (Progressing)**
>     - **Node.js 部署**：安裝 Node.js LTS 版本，準備啟動 Quartz 引擎。
>     - **Server 嘗試**：研究使用 `npx quartz build --serve` 啟動本地預覽伺服器。
>     - **目前瓶頸**：本地 Server 尚未成功開通，正處理 `npm i` 依賴安裝與環境路徑校準。
> - **📈 運作策略調整**：
>     - 實施「提早收工」與「止損策略」，針對深夜 GitHub Actions 的不穩定報錯不再盲目推播，轉為本機研究模式。
> [!abstract]- 📅 2026-01-14 | 系統重構、數據追蹤與核心入庫
> - **📊 流量統計雙重佈署 (GoatCounter)**
>     - **Header 追蹤**：植入於 `SharedLayout` 之 `head` 區塊，確保腳本優先加載，精準捕捉所有來源流量。
>     - **Footer 追蹤**：植入於 `footer` 區塊，作為非關鍵路徑追蹤，優化頁面渲染速度。
> - **🧩 側邊欄邏輯優化 (Explorer Refactor)**
>     - 於 `quartz.layout.ts` 注入自定義 `sortFn` 邏輯。
>     - **排序權重**：`About` > `Library` > `隨筆` > `網站設置LOG`。
>     - **交互強化**：開啟資料夾點擊跳轉功能 (`folderClickBehavior: "link"`)。
> - **🏺 視覺識別與 Emoji 系統**
>     - 確立側邊欄標題：`🏺 全站導覽`。
>     - 檔案標題全面導入視覺錨點：`📚 Library`、`✍️ 隨筆`、`⚙️ LOG`。
> - **📚 核心藏書入庫**
>     - 《陶藝講座-邱煥堂》：理論基石架構完成。
>     - 《柴燒-陳威恩》：實戰數據與窯爐結構整理。
>     - 《陶藝科學》：導入高密度數據實驗模板。
> - **💬 評論系統與互動**
>     - 成功掛載 **Giscus**，串接 GitHub Discussions 開啟讀者互動。

> [!abstract]- 📅 2026-01-13 | 風格確立與版面調校
> - **🎨 風格設定**：選定深色模式 (Dark Mode) 為預設，符合職人沉靜觀感的視覺調性。
> - **🔗 網域配置**：修正 `baseUrl`，確立網域路徑為 `vcdvcd214.github.io/lin-yung-chang`。
> - **🛠️ 組件配置**：加入搜尋框 (Search)、深色切換 (Darkmode) 與閱讀模式 (ReaderMode)。

> [!abstract]- 📅 2026-01-12 | 破土動工：環境部署
> - **🚀 技術選型**：採用 **Quartz 4.0** 引擎，建立基於 Markdown 的數位花園。
> - **📦 儲存與同步**：使用 **GitHub** 儲存代碼，透過 **GitHub Desktop** 進行穩定上傳與版本管理。
> - **🤖 部署自動化**：建立 GitHub Actions，實現 `git push` 即自動構建與發佈網站。
> - **📈 SEO 基礎**：配置 **Google Search Console**，優化網站搜尋引擎曝光。

---

### 🛠️ 技術堆疊 (Technical Stack)

| 類別 | 項目 | 備註 |
| :--- | :--- | :--- |
| **Engine** | [Quartz 4.0](https://quartz.jzhao.xyz/) | SPA 模式開啟 |
| **Editor** | **Obsidian** | 支援雙向連結與 Callout 語法 |
| **Storage** | **GitHub** | 搭配 **GitHub Desktop** 管理 |
| **Comments** | **Giscus** | GitHub Discussions 後端 |
| **Analytics** | **GoatCounter** | 雙重 (Head & Footer) 佈署 |
| **SEO** | **Google** | Search Console 驗證 |

---

### 💡 更新守則
每次進行技術更動或大規模內容更新時，請於最上方新增一個 `[!abstract]-` 區塊，確保「靜觀微語」的成長軌跡清晰可尋。