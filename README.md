# ⚔️ QUIZ DUNGEON — 像素問答闖關遊戲

一個以 **Pixel Art 像素風** 為主題的網頁闖關問答遊戲，使用 React Vite 開發，後端透過 Google Apps Script 串接 Google Sheets 管理題目與作答紀錄。

---

## 📋 目錄

- [環境需求](#環境需求)
- [本地啟動](#本地啟動)
- [環境變數說明](#環境變數說明)
- [Google Sheets 設定](#google-sheets-設定)
- [Google Apps Script 部署](#google-apps-script-部署)
- [題目格式與範例](#題目格式與範例)
- [遊戲流程說明](#遊戲流程說明)

---

## 環境需求

| 工具 | 版本需求 |
|------|---------|
| Node.js | 18.x 或 20.x |
| npm | 9+ |
| 瀏覽器 | Chrome / Edge / Firefox（現代版本）|

---

## 本地啟動

```bash
# 1. 安裝依賴
npm install

# 2. 複製環境變數範本並填入設定
cp .env.example .env

# 3. 啟動開發伺服器
npm run dev
# → http://localhost:5173
```

> 若尚未設定 `VITE_GAS_URL`，遊戲會自動進入 **Demo 模式**，使用內建的 10 題範例問題，無需 Google Sheets 也可完整試玩。

---

## 環境變數說明

編輯專案根目錄的 `.env` 檔案：

```env
# Google Apps Script 部署後的 Web App URL（詳見下方設定步驟）
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 通過門檻：至少答對幾題才算通關（預設 7 題）
VITE_PASS_THRESHOLD=7

# 每場遊戲的題目數量（預設 10 題）
VITE_QUESTION_COUNT=10
```

---

## Google Sheets 設定

### Step 1 — 建立 Google 試算表

前往 [Google Sheets](https://sheets.google.com) 新增一份試算表，命名隨意（如 `QuizDungeon`）。

### Step 2 — 建立「題目」工作表

將預設工作表重新命名為 **`題目`**，並在第一列填入以下欄位標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 題號 | 題目 | A | B | C | D | 解答 |

- **解答** 欄位填入正確答案的代號：`A`、`B`、`C` 或 `D`（大寫英文字母）
- 從第二列開始逐行填入題目
- 範例見下方「[題目格式與範例](#題目格式與範例)」章節

### Step 3 — 建立「回答」工作表

新增第二個工作表，命名為 **`回答`**，並在第一列填入以下欄位標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闖關次數 | 總分（累計）| 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

> 第二列起由 Google Apps Script 自動寫入，**不需手動填寫**。

---

## Google Apps Script 部署

### Step 1 — 開啟 Apps Script 編輯器

在剛建立的試算表中，點選上方選單：

```
擴充功能 → Apps Script
```

### Step 2 — 貼上程式碼

1. 刪除編輯器內預設的所有內容
2. 將 `gas/Code.gs` 的完整內容複製貼上
3. 按 **Ctrl + S** 儲存（或點選上方磁碟圖示）

### Step 3 — 建立部署

點選右上角 **「部署」→「新增部署」**：

| 設定項目 | 值 |
|---------|---|
| 選取類型 | Web 應用程式 |
| 說明 | （任意填寫，如 `QuizDungeon v1`）|
| 以此身分執行 | **我（你的 Google 帳號）** |
| 誰可以存取 | **所有人** |

點選「**部署**」，Google 會要求你授予試算表存取權限，請點選「允許」。

### Step 4 — 複製 Web App URL

授權完成後，你會看到一個如下格式的 URL：

```
https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXX/exec
```

將此 URL 填入 `.env` 的 `VITE_GAS_URL` 欄位。

### Step 5 — 重新啟動開發伺服器

```bash
# 終止目前的 dev server（Ctrl+C），再重新啟動以載入新的環境變數
npm run dev
```

> ⚠️ **注意**：每次修改 `gas/Code.gs` 後，都需要重新「新增部署」（不是「管理部署」），否則 URL 仍指向舊版程式碼。

---

## GitHub Pages 自動部署

本專案已設定 GitHub Actions，推送至 GitHub 後可自動部署。

### Step 1 — 設定 Repository Secrets

在 GitHub Repository 頁面：
1. 進入 **Settings** → **Secrets and variables** → **Actions**
2. 在 **Repository secrets** 區域，點選 **New repository secret**
3. 新增變數：
   - Name: `VITE_GAS_URL`
   - Value: (貼上你的 Google Apps Script Web App URL)

> 若需調整遊戲參數，可在 **Repository variables** 區域新增：
> - `VITE_PASS_THRESHOLD` (預設 7)
> - `VITE_QUESTION_COUNT` (預設 10)

### Step 2 — 開啟 GitHub Pages

1. 進入 **Settings** → **Pages**
2. 在 **Build and deployment** → **Source** 下拉選單中，選擇 **GitHub Actions**
3. 無需其他設定，Actions 會自動處理構建與部署

### Step 3 — 推送程式碼

將程式碼 push 到 `main` 分支，GitHub Actions 會自動觸發構建。完成後，你的遊戲將在 `https://<你的帳號>.github.io/<專案名稱>/` 上線。

---

## 題目格式與範例

以下是 10 道「**生成式 AI 基礎知識**」選擇題，可直接複製貼入 Google Sheets 的「題目」工作表（從第 2 列開始貼上）。

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | 「生成式 AI」（Generative AI）的主要特徵是？ | 只能分析現有資料 | 能夠生成新的內容（文字、圖像、音訊等）| 專門用於資料庫查詢 | 只能執行數值計算 | B |
| 2 | GPT 的全名是什麼？ | General Purpose Transformer | Generative Pre-trained Transformer | Graphical Processing Technology | Global Prediction Tool | B |
| 3 | 下列哪項技術是大型語言模型（LLM）的基礎架構？ | CNN（卷積神經網路）| RNN（遞迴神經網路）| Transformer | SVM（支持向量機）| C |
| 4 | 什麼是「Prompt Engineering」？ | 訓練 AI 模型的過程 | 設計有效輸入指令以引導 AI 產生期望輸出 | 優化 GPU 運算效能 | 建立向量資料庫 | B |
| 5 | RAG（Retrieval-Augmented Generation）技術的主要目的是？ | 加速模型訓練速度 | 讓模型能存取外部知識庫以提升回答精確度 | 壓縮模型大小 | 將圖片轉換為文字 | B |
| 6 | 「幻覺」（Hallucination）在 AI 語境中指的是？ | AI 產生視覺圖像的能力 | 模型生成看似合理但實際上錯誤的資訊 | AI 進行創意發想的過程 | 模型無法回應的情況 | B |
| 7 | 下列哪個模型是由 OpenAI 開發？ | Gemini | Claude | LLaMA | GPT-4 | D |
| 8 | 「Fine-tuning（微調）」是指？ | 從零開始訓練一個全新模型 | 在預訓練模型上用特定資料集進一步訓練 | 壓縮現有模型以節省記憶體 | 評估模型輸出品質的方法 | B |
| 9 | Embeddings（嵌入向量）在 AI 中的用途主要是？ | 儲存圖片像素資料 | 將文字轉換為可計算相似度的數值向量 | 加密使用者資料 | 生成程式碼 | B |
| 10 | 「Zero-shot」學習指的是什麼情境？ | 模型使用大量範例進行訓練 | 模型在完全沒有提供範例的情況下直接回答任務 | 模型使用零筆資料進行訓練 | 模型的推論速度為零延遲 | B |

---

## 遊戲流程說明

```
首頁（輸入 ID）
     ↓
 載入畫面（從 Google Sheets 隨機抓取 N 題）
     ↓
 答題畫面（每題配有像素關主圖、A/B/C/D 選項）
  ✅ 答對 → 綠色閃爍
  ❌ 答錯 → 紅色閃爍
     ↓
 結果畫面（顯示分數 / 通關或失敗）
     ↓
 成績自動寫入 Google Sheets「回答」工作表
```

### 回答工作表紀錄規則

| 情境 | 行為 |
|------|------|
| 新 ID 首次遊玩 | 新增一列並寫入所有欄位 |
| 同 ID 再次遊玩 | 累加「闖關次數」、更新「最高分」與「最近遊玩時間」|
| 同 ID 首次通關 | 寫入「第一次通關分數」，後續通關**不覆蓋** |
| 同 ID 每次通關 | 累加「花了幾次通關」計數 |
