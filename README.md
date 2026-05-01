# ItemMaster | AI 雲端智慧庫存管家

ItemMaster 是一個輕量級、伺服器端（Serverless）的 Web 應用程式，結合了 **Google Gemini AI** 的圖像辨識能力與 **Supabase** 的即時雲端同步功能。專為手機拍照記錄、物品到期管理而設計。

## 🌟 核心功能

- **AI 自動辨識**：拍一張照，自動抓取照片中的物品名稱（支援繁體中文）。
- **雲端同步**：基於 Supabase，多裝置（手機、電腦）即時同步庫存資訊。
- **照片儲存**：不僅存文字，連物品照片也一併上傳雲端，方便日後核對。
- **到期管理**：自動追蹤過期日期，優先排列即將過期的物品，並以紅字提醒。
- **靈活輸入**：支援「拍照+AI」、「拍照+手動」以及「純手動」三種輸入模式。

---

## 🚀 快速開始 (GitHub Pages 部署)

1. **建立 Repo**：將此專案推送至您的 GitHub。
2. **開啟 Pages**：進入 GitHub `Settings > Pages`，將 Branch 設為 `main` 並儲存。
3. **完成設定**：開啟您的 Pages 網址，點選右上角 **⚙️ 設定**，填入下方的 API 金鑰。

---

## 🛠️ 設定教學

### 1. 取得 Gemini API Key
1. 前往 [Google AI Studio](https://aistudio.google.com/)。
2. 點擊左側選單的 **「Get API key」**。
3. 建立並複製您的專屬金鑰。

### 2. Supabase 資料庫設定
登入 [Supabase](https://supabase.com/) 並建立新專案，接著完成以下步驟：

#### A. 建立資料表 (SQL Editor)
請在 SQL Editor 中執行以下指令：
```sql
-- 建立資料表
CREATE TABLE inventory (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  expiry date,
  location text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 開啟並設定所有人讀寫權限 (修復 401 錯誤)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Full Access" ON inventory FOR ALL TO anon USING (true) WITH CHECK (true);

-- 強制刷新快取
NOTIFY pgrst, 'reload schema';
```

#### B. 建立照片儲存桶 (Storage)
1. 點選左側 **Storage** 分頁。
2. 建立一個名為 `item-photos` 的新儲存桶 (Bucket)。
3. **務必將其設為 "Public"**。
4. 在 SQL Editor 執行以下指令以開放匿名上傳：
```sql
CREATE POLICY "Allow Public" ON storage.objects 
FOR ALL TO anon USING (bucket_id = 'item-photos');
```

---

## 📱 使用說明

1. **掃描物品**：
   - 點擊「📷 拍攝照片」上傳物品照。
   - 點選「✨ AI 辨識物品」自動填寫，或點選「✍️ 略過辨識」自行輸入。
   - 填寫「到期日」與「存放地點」後儲存。
2. **手動記錄**：
   - 若不需拍照，可點選「✍️ 直接手動新增 (不拍照)」。
3. **查看庫存**：
   - 切換至「📦 庫存」分頁，可查看所有物品，點擊縮圖可預覽大圖。

---

## 🛠️ 技術棧
- **Frontend**: Vanilla JavaScript, Tailwind CSS (via CDN)
- **AI**: Google Gemini-1.5-Flash (via API)
- **Backend/DB**: Supabase (PostgreSQL + Storage)
- **Deployment**: GitHub Pages

---

## 📝 授權與隱私
此專案所有 API Key 均儲存於使用者的瀏覽器 `localStorage` 中，不會經過任何中轉伺服器，確保您的金鑰安全。
