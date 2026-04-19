# Sliding & Anime Research Labs

Claude Code 產出「code to ppt / code to slide」各版本的最佳實踐收藏庫。

用途：把在 Claude Code 中迭代出來的最好的投影片 / 動畫程式碼實踐集中存放，方便分享給其他機器上的 agent（例如 hermes）學習、比對、復用。

## 目錄結構

每個資料夾是一個獨立的版本 / 實驗，命名慣例：

```
<專案名>_<功能>_v<版本號>/
```

目前收錄：

- `Genesis_Proj_Sliding_v1/` — Genesis 專案，第一版 sliding 實作
- `Genesis Proj-Add_Chapter_Switching_v2/` — v1 基礎上加入章節切換功能

## 每個版本通常包含

- `*.html` — standalone 投影片（可直接瀏覽器打開）
- `*.jsx` — 拆解後的 React 元件（`app.jsx` / `scenes.jsx` / `animations.jsx`）
- `*.png` — 開發過程的 debug / check 截圖
- `Navigation.md`（v2 起）— 章節 / 導覽說明

## 使用方式

```bash
git clone https://github.com/darwin7381/sliding_and_anime_research_labs.git
```

直接用瀏覽器開啟任一版本資料夾內的 `*.html` 即可預覽；`.jsx` 為原始元件實作，供 agent 學習 / 改寫。

## 新增版本

新增資料夾、遵循命名慣例（`v3`、`v4`…），把該版本所有檔案放進去即可。不要覆蓋舊版，每個版本都是一個 snapshot。
