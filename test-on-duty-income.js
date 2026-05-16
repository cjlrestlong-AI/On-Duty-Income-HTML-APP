const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync("index.html", "utf8");
const scriptMatch = html.match(/<script id="income-core" type="text\/plain">([\s\S]*?)<\/script>/);
assert(scriptMatch, "income core script should exist");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const {
  daysInMonth,
  baseEarnedAt,
  sumExtraIncome,
  totalsFor,
  convertAmount,
  chooseRewards,
} = sandbox.OnDutyIncomeCore;

assert.strictEqual(daysInMonth(new Date("2026-05-16T12:00:00")), 31);
assert.strictEqual(baseEarnedAt(31000, new Date("2026-05-16T08:59:00")), 374.31);
assert.strictEqual(baseEarnedAt(31000, new Date("2026-05-16T14:30:00")), 604.17);
assert.strictEqual(baseEarnedAt(31000, new Date("2026-05-16T20:01:00")), 834.03);

const extras = [
  { amount: 300, type: "side", note: "project", date: "2026-05-16T10:00:00.000Z" },
  { amount: 1200, type: "bonus", note: "gift", date: "2026-05-20T10:00:00.000Z" },
  { amount: 5000, type: "yearEnd", note: "annual", date: "2026-12-31T10:00:00.000Z" },
];

assert.strictEqual(sumExtraIncome(extras, "day", new Date("2026-05-16T12:00:00.000Z")), 300);
assert.strictEqual(sumExtraIncome(extras, "month", new Date("2026-05-16T12:00:00.000Z")), 1500);
assert.strictEqual(sumExtraIncome(extras, "year", new Date("2026-05-16T12:00:00.000Z")), 6500);

const totals = totalsFor(31000, extras, new Date("2026-05-16T14:30:00"));
assert.strictEqual(totals.todayBase, 604.17);
assert.strictEqual(totals.todayExtra, 300);
assert.strictEqual(totals.today, 904.17);
assert.strictEqual(totals.monthExtra, 1500);
assert(totals.year >= 6500, "year total includes extra income and base earned days");

assert.strictEqual(convertAmount(100, "HKD", { HKD: 1, CNY: 0.92, USD: 0.128 }), 100);
assert.strictEqual(convertAmount(100, "CNY", { HKD: 1, CNY: 0.92, USD: 0.128 }), 92);

const rewards = chooseRewards(300, [
  { name: "Premium Burger", price: 30 },
  { name: "Silk Scarf", price: 1200 },
]);
assert.strictEqual(rewards[0].name, "Premium Burger");
assert.strictEqual(rewards[0].price, 30);
assert.strictEqual(rewards[0].count, 10);

assert(html.includes("const isPreview = !state.monthlyIncome;"), "dashboard should support preview mode before income setup");
assert(html.includes('language: "en"'), "English should be the default language");
assert(html.includes('id="languageSelect"'), "language selector should be available in the header");
assert(html.includes('function applyLanguage()'), "UI text should be driven by the language dictionary");
assert(html.includes("Save your income to switch from preview to your real numbers"), "default setup copy should be English");
assert(html.includes("後面的畫面已可預覽"), "Chinese UI copy should remain available as a language option");
assert(html.includes('id="headerSettingsBtn"'), "income settings should live in the top-right header button");
assert(!html.includes('id="editIncomeBtn"'), "hero card should not contain a persistent monthly income button");
assert(html.includes("setupScreen.remove();"), "setup screen should be removed after initialization");
assert(!html.includes('document.getElementById("setupScreen").classList.remove("hidden");'), "setup screen should not auto-open on the homepage");
assert(html.includes('id="saveIncomeBtn"'), "income save button should have a direct click handler");
assert(html.includes('id="saveIncomeBtn" type="button"'), "income save button should not rely on native submit");
assert(html.includes('document.getElementById("saveIncomeBtn").addEventListener("click", saveIncomeSettings);'), "income save button should call save directly");
assert(html.includes('id="saveExtraBtn"'), "extra income save button should have a direct click handler");
assert(html.includes(">Save & Close<"), "income settings primary action should default to English");
assert(html.includes(">Add & Close<"), "extra income primary action should default to English");
assert(html.includes('id="saveExtraBtn" type="button"'), "extra income save button should not rely on native submit");
assert(html.includes('document.getElementById("saveExtraBtn").addEventListener("click", saveExtraIncome);'), "extra income save button should call save directly");
assert(!html.includes("requestSubmit"), "modal primary buttons should not depend on requestSubmit");
assert(html.includes('form.checkValidity()'), "save handlers should run form validity checks manually");
assert(html.includes('closeDialog(document.getElementById("extraDialog"));'), "extra income submit should close its dialog");
assert(html.includes('dialog.removeAttribute("open");'), "dialog close should force-remove the open attribute");
assert(html.includes('dialog.style.display = "none";'), "dialog close should force-hide the dialog visually");
assert(html.includes("font-variant-numeric: tabular-nums"), "main money display should use tabular numbers");
assert(html.includes("function fitMainMoney()"), "main money display should auto-fit to the hero width");
assert(html.includes("scrollWidth <= available"), "main money fitting should measure overflow");
assert(html.includes("@media (max-width: 390px)"), "mobile money display should have a smaller font size rule");
assert(html.includes("LUMINOUS"), "premium luminous skin should be present");
assert(html.includes("background: linear-gradient(135deg, #7c3aed"), "primary actions should use neon purple gradient");
assert(html.includes("backdrop-filter: blur(20px)"), "hero card should use backdrop blur");
assert(html.includes("rgba(8, 20, 52, 0.5)"), "hero card should stay translucent so backdrop blur is visible");
assert(html.includes("radial-gradient"), "page should include blurred background detail behind glass panels");
assert(html.includes("backdrop-filter: blur(24px)"), "navigation should use backdrop blur");
assert(html.includes("<symbol id=\"icon-home\""), "custom SVG icon sprite should include home icon");
assert(html.includes("<symbol id=\"icon-coffee\""), "custom SVG icon sprite should include reward icons");
assert(html.includes("function iconMarkup("), "reward cards should render custom SVG icons");
assert(html.includes('icon: "coffee"'), "reward catalog should use icon keys instead of emoji icons");
assert(html.includes('<use href="#icon-refresh"></use>'), "refresh control should use custom SVG icon");
assert(!html.includes('class="brand-mark"'), "header should not include the confusing brand mark object");
assert(html.includes(".bottom-nav .nav-icon"), "bottom navigation icons should use designed icon containers");
assert(html.includes(".primary-button::after"), "primary buttons should include a premium light sweep");
assert(html.includes("z-index: 120;"), "bottom navigation should sit above animation overlays");
assert(html.includes("function activateNav(button)"), "bottom navigation should have a direct activation handler");
assert(html.includes('href="#rewards"'), "bottom navigation should use native anchor fallback");
assert(html.includes('window.scrollTo({ top, behavior: "smooth" });'), "bottom navigation should use explicit window scrolling");
assert(!html.includes('<button type="button" data-target="rewards"'), "bottom navigation should not rely on inert buttons");

console.log("All income core tests passed.");
