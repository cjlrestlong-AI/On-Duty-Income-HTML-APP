# On Duty Income · Luminous 💰

把上班時間變成看得見的到賬 — 即時收入追蹤儀表板。

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)
![Dark Fintech](https://img.shields.io/badge/Theme-Dark%20Fintech-00e5ff)

## 連結

- 🌐 **線上體驗**: https://cjlrestlong-ai.github.io/On-Duty-Income-HTML-APP/
- 📂 **GitHub**: https://github.com/cjlrestlong-AI/On-Duty-Income-HTML-APP

---

## 功能特色

### 📊 即時收入計算
- 輸入月薪，從 00:00 到 24:00 每秒自動累積
- 今日收入、本月累計、年度總額一目瞭然
- 支援 HKD / CNY / USD 三種貨幣換算

### 🎰 翻牌數字動畫
- 每個數字獨立滾動，右邊位數轉更快
- 分位最快（0.08s）、個位中等（0.16s）、高位最慢（0.40s）

### 🏦 3D 鈔票堆疊
- 真實港幣圖片（HK$10 / HK$100）
- 兩疊鈔票小山，可切換「整理/打散」
- 滑鼠移上鈔票會微微浮起

### 🎊 慶祝鈔票雨
- 添加額外收入時觸發全螢幕鈔票雨
- 掉落總值 = 輸入金額，一毛不差
- 近距離大鈔慢慢飄、遠景小鈔快速落
- HK$3,000+ 混合紅色 HK$100 鈔票

### 🌙 Luminous 主題
- 深藍暗色背景 + 動態極光
- 玻璃擬態卡片設計
- 青色霓虹（#00e5ff）主色調
- 繁體中文 / English 雙語介面

---

## 開發

### 本機開啟

直接雙擊 `index.html` 或用瀏覽器開啟：

```bash
open ~/"Documents/New project-on duty html/index.html"
```

### 部署

推送至 GitHub 即可自動更新 GitHub Pages：

```bash
cd ~/"Documents/New project-on duty html"
git add .
git commit -m "更新說明"
git push
```

等待 1-2 分鐘，前往 https://cjlrestlong-ai.github.io/On-Duty-Income-HTML-APP/

---

## 使用技術

- 純 HTML / CSS / JavaScript（無框架）
- SVG 圖示 sprite
- CSS3 動畫（keyframes、transition、transform）
- CSS 玻璃擬態（backdrop-filter）
- 3D 變形（perspective、rotateX/Y/Z）
- GitHub Pages 部署

---

## 圖片來源

- `hkd10.jpg`、`hkd100.jpg`、`HKD100x100.png` — 用戶自備
