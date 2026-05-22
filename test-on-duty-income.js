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
  eventDate,
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

const tutoringExtras = [
  { amount: 900, type: "tutoring", lessonDate: "2026-05-18", lessonHours: 2, hourlyRate: 450, date: "2026-05-21T10:00:00.000Z" },
];
assert.strictEqual(eventDate(tutoringExtras[0]).getDate(), 18);
assert.strictEqual(sumExtraIncome(tutoringExtras, "day", new Date("2026-05-18T12:00:00")), 900);
assert.strictEqual(sumExtraIncome(tutoringExtras, "day", new Date("2026-05-21T12:00:00")), 0);

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
assert(html.includes("dialog[open]"), "dialogs should only be displayed while open");
assert(html.includes("display: none;\n      border: 0;"), "closed dialogs should be hidden in browsers that render dialog as ordinary content");
assert(!html.includes("border-color: rgba(0, 229, 255, 0.3);"), "form focus border should not use the old cyan accent");
assert(html.includes("border-color: rgba(184, 148, 86, 0.42);"), "form focus border should use champagne gold");
assert(html.includes("box-shadow: 0 0 0 3px rgba(216, 189, 130, 0.14);"), "form focus ring should use a soft champagne glow");
assert(html.includes("top: max(76px, calc(env(safe-area-inset-top, 0px) + 76px));"), "toast should sit below the header and safe area instead of protruding from the top edge");
assert(html.includes("opacity: 0;\n      pointer-events: none;"), "hidden toast should not peek out above the viewport");
assert(html.includes("font-variant-numeric: tabular-nums"), "main money display should use tabular numbers");
assert(html.includes("function fitMainMoney()"), "main money display should auto-fit to the hero width");
assert(html.includes(".scroll-amount"), "main money digits should live in a grouped amount span");
assert(html.includes("justify-content: flex-start;"), "main money group should match the provided left-led reference style");
assert(html.includes("text-align: left;"), "main money container should keep the HK$ left anchor fixed");
assert(html.includes("min-width: 100%;"), "main money row should keep a stable full-width left anchor");
assert(html.includes("align-items: baseline;"), "main money currency and punctuation should share a visual baseline");
assert(html.includes("gap: 0.12em;"), "main money currency should sit close to the amount");
assert(html.includes("flex: 0 0 auto;"), "main money amount should never shrink over the HK$ symbol");
assert(html.includes("min-width: max-content;"), "main money amount should preserve its intrinsic width while fitting adjusts font size");
assert(html.includes('id="scrollAmount"'), "main money amount group should be measurable for auto-fit");
assert(html.includes("const preferredSize = Math.min(window.innerWidth * 0.16, 82);"), "main money display should choose a responsive preferred size before auto-fitting");
assert(html.includes("padding: 0.04em 1.02em 0.08em 0;"), "main money display should keep a right breathing boundary aligned with the top controls");
assert(html.includes('const currencyTabs = document.getElementById("currencyTabs");'), "main money auto-fit should use the currency tabs as the right alignment target");
assert(html.includes("const targetRight = tabsRect ? tabsRect.right : moneyRect.right - 88;"), "main money auto-fit should align the last digit under the USD boundary");
assert(html.includes("const available = Math.max(0, targetRight - moneyRect.left);"), "main money auto-fit should measure from fixed HK$ left anchor to the target boundary");
assert(html.includes("const measureContentWidth = () =>"), "main money auto-fit should remeasure after shrinking");
assert(html.includes("for (let i = 0; i < 8; i++)"), "main money auto-fit should binary-search a non-overlapping size");
assert(html.includes("let low = minSize;"), "main money auto-fit should keep a lower bound for extreme values");
assert(!html.includes("max-width: 82%;"), "main money display should not be clipped by the old desktop width cap");
assert(html.includes("overflow: visible;"), "main money display should not crop digit edges");
assert(html.includes("if (measureContentWidth() <= available) low = mid;"), "main money fitting should find the largest size that fits the USD boundary");
assert(html.includes("@media (max-width: 390px)"), "mobile money display should have a smaller font size rule");
assert(html.includes("Minimal Luxury Tech"), "minimal luxury tech skin should be present");
assert(html.includes("--page: #f5f0e7"), "theme should use a warm off-white page token");
assert(html.includes("assets/luxury-tech/income-orbit.svg"), "hero should use a subtle local abstract income orbit visual");
assert(html.includes('class="hero-object"'), "hero should include a restrained decorative light accent");
assert(html.includes("opacity: 0.16;"), "mobile hero accent should stay subtle and avoid a distracting circle");
assert(html.includes("background: #202225;"), "primary actions should use a restrained dark CTA");
assert(!html.includes("LUMINOUS"), "the old luminous theme label should be removed");
assert(html.includes("body::after,\n    .ambient-orbs"), "neon overlays and ambient orbs should be disabled by the luxury skin");
assert(html.includes("<symbol id=\"icon-home\""), "custom SVG icon sprite should include home icon");
assert(html.includes("<symbol id=\"icon-coffee\""), "custom SVG icon sprite should include reward icons");
assert(html.includes("function iconMarkup("), "reward cards should render custom SVG icons");
assert(html.includes('icon: "coffee"'), "reward catalog should use icon keys instead of emoji icons");
assert(html.includes("const rewardImages = {"), "reward cards should map catalog icons to individual transparent PNGs");
assert(html.includes('src="\' + src + \'"'), "reward objects should render as standalone image elements");
assert(html.includes('object-fit: contain;'), "reward object images should preserve their proportions");
assert(!html.includes(".lux-icon {\n      width: min(218px, 74vw);\n      height: min(218px, 74vw);\n      display: block;\n      object-fit: contain;\n      object-position: center;\n      transform: rotateX"), "reward object images should not be distorted with CSS 3D rotation");
assert(html.includes("let memoryStateCache = null;"), "state persistence should have an in-memory fallback");
assert(html.includes("return false;"), "saveState should not throw when localStorage is blocked");
assert(!html.includes("function saveState() {\n      localStorage.setItem"), "saveState should not write localStorage without a guard");
assert(html.includes("let rewardAutoTimer = null;"), "reward carousel should keep an auto-rotation timer");
assert(html.includes("function rewardCarouselItems(amountHkd, catalog)"), "reward carousel should build multiple affordable and upcoming items");
assert(html.includes("function updateRewardCarousel()"), "reward carousel should update 3D slide positions");
assert(html.includes("setInterval(() =>"), "reward carousel should auto-rotate when idle");
assert(html.includes('data-hidden="true"'), "reward carousel should hide distant depth slides");
assert(html.includes("let currentRewardItems = [];"), "reward caption should use a fixed stage-level item source");
assert(html.includes('class="reward-caption"'), "reward caption should live in a fixed rail overlay");
assert(html.includes("function updateRewardCaption("), "reward caption should update independently from slide movement");
assert(html.includes('caption.classList.add("is-fading")'), "reward caption should fade in place during slide changes");
assert(html.includes("text-shadow: none;"), "reward caption text should stay crisp without heavy dirty shadows");
assert(!html.includes("rgba(0, 0, 0, 0.55)"), "reward quantity should not use heavy black glow");
assert(!html.includes("reward-body"), "reward slide text should not be embedded inside moving cards");
assert(html.includes(".reward-caption::before"), "reward caption should use a soft mist instead of a visible card");
assert(!html.includes("rgba(7, 18, 44, 0.78)"), "reward caption should not use a rectangular dark card gradient");
assert(html.includes("unitZh: \"杯\""), "Chinese reward titles should include natural measure words");
assert(html.includes("function rewardTitleMarkup(item)"), "reward titles should render structured quantity labels");
assert(html.includes('class="reward-quantity"'), "reward counts should be visually emphasized");
assert(!html.includes('item.count + \" × \" + escapeHtml(item.name)'), "reward titles should not use plain count-times-name strings");
assert(html.includes("onpointerdown"), "reward carousel should support pointer drag interaction");
assert(html.includes("--slide-x"), "reward carousel should use precomputed CSS variables for browser-compatible transforms");
assert(html.includes("--slide-brightness"), "reward carousel should darken side slides with brightness control");
assert(html.includes('.reward-card[data-offset="0"] .reward-art::after'), "center reward slide should have a stage spotlight");
assert(!html.includes("var(--offset) *"), "reward carousel transforms should not rely on unsupported CSS multiplication");
assert(!html.includes("displayRewards = [{ count: null"), "reward carousel should not collapse into a single empty-state card");
assert(!html.includes("const emojiMap"), "reward cards should not use emoji fallback art");
assert(!html.includes('background-image: url("reward-stickers-ios3d.png")'), "reward cards should not use the old rectangular sprite background");
assert(!html.includes("const stickerPositions = {"), "reward cards should not use sprite-position cropping");
assert(html.includes('background-image: url("assets/money/hkd-10-luxury.png")'), "falling HK$10 notes should use the stylized luxury asset");
assert(html.includes('background-image: url("assets/money/hkd-100-bundle-luxury.png")'), "stacked HK$100 bundles should use the stylized luxury asset");
assert(html.includes('background-image: url("assets/money/hkd-1-coin-luxury.png")'), "HK$1 coin drops should use the stylized coin asset");
assert(html.includes('"assets/money/hkd-100-luxury.png"'), "celebration HK$100 notes should use the stylized luxury asset");
assert(!html.includes('url("assets/luxury-tech/glass-coin.svg")'), "money stage should not show the large circular glass-coin decoration");
assert(!html.includes("rgba(255,255,255,0.42)"), "money tokens should not use a rectangular white halo shadow");
assert(!html.includes('background-image: url("hkd10.jpg")'), "money stage should not use realistic HK$10 photos");
assert(!html.includes('background-image: url("HKD100x100.png")'), "money stage should not use realistic HK$100 bundle photos");
assert(!html.includes('"hkd100.jpg"'), "celebration animation should not use realistic HK$100 photos");
["hkd-1-coin-luxury", "hkd-10-luxury", "hkd-100-luxury", "hkd-100-bundle-luxury"].forEach((name) => {
  const assetPath = `assets/money/${name}.png`;
  assert(fs.existsSync(assetPath), `${assetPath} should exist`);
  const bytes = fs.readFileSync(assetPath);
  assert([4, 6].includes(bytes[25]), `${assetPath} should be a PNG with an alpha channel`);
});
["coffee", "burger", "drink", "candle", "sleep", "sparkle", "earbuds", "bag", "designer-bag", "hotel", "laptop", "plane"].forEach((name) => {
  const assetPath = `assets/rewards/${name}.png`;
  assert(fs.existsSync(assetPath), `${assetPath} should exist`);
  const bytes = fs.readFileSync(assetPath);
  assert([4, 6].includes(bytes[25]), `${assetPath} should be a PNG with an alpha channel`);
});
["hero-ring", "glass-coin", "income-orbit"].forEach((name) => {
  const assetPath = `assets/luxury-tech/${name}.svg`;
  assert(fs.existsSync(assetPath), `${assetPath} should exist`);
});
assert(html.includes('<use href="#icon-refresh"></use>'), "refresh control should use custom SVG icon");
assert(!html.includes('class="brand-mark"'), "header should not include the confusing brand mark object");
assert(html.includes(".bottom-nav .nav-icon"), "bottom navigation icons should use designed icon containers");
assert(html.includes(".primary-button::after"), "primary buttons should include a premium light sweep");
assert(html.includes("z-index: 120;"), "bottom navigation should sit above animation overlays");
assert(html.includes("function activateNav(button)"), "bottom navigation should have a direct activation handler");
assert(html.includes('href="#rewards"'), "bottom navigation should use native anchor fallback");
assert(html.includes('href="#lessons"'), "bottom navigation should expose the Lessons tab");
assert(html.includes("grid-template-columns: repeat(5, 1fr);"), "bottom navigation should fit five tabs");
assert(html.includes('window.scrollTo({ top, behavior: "smooth" });'), "bottom navigation should use explicit window scrolling");
assert(!html.includes('<button type="button" data-target="rewards"'), "bottom navigation should not rely on inert buttons");
assert(html.includes('id="calendarSummary"'), "calendar should include a monthly summary dashboard");
assert(!html.includes('id="calendarMini"'), "calendar should not render the duplicate mini month overview");
assert(html.includes('id="calendarPopover"'), "calendar should include a floating date-detail popover");
assert(html.includes("let selectedCalendarDateKey ="), "calendar should remember the selected date");
assert(html.includes("let expandedCalendarEventKey ="), "calendar should remember whether selected-day extra income is expanded");
assert(html.includes("function renderCalendarSummary("), "calendar summary should be rendered dynamically");
assert(!html.includes("function renderMobileCalendar("), "calendar should not keep the removed mini overview renderer");
assert(html.includes("function calendarDetailMarkup("), "calendar date detail should be generated as reusable popover markup");
assert(html.includes("function showCalendarPopover(key, anchorEl)"), "calendar should show date details in a hover/tap popover");
assert(html.includes("function hideCalendarPopover()"), "calendar popover should be dismissible");
assert(html.includes("function positionCalendarPopover(anchorEl)"), "calendar popover should position itself near the hovered/tapped date");
assert(html.includes("function calendarDayData("), "calendar views should share a single day-state model");
assert(html.includes('class="boost-badge"'), "extra income days should use a visible boost badge");
assert(html.includes('class="today-progress"'), "today's calendar cell should show workday progress");
assert(html.includes('isPast ? "earned" : "future"'), "calendar should visually separate earned and future dates");
assert(html.includes("calendarGrid\").addEventListener(\"click\""), "calendar days should be clickable");
assert(html.includes("calendarGrid\").addEventListener(\"mouseover\""), "desktop calendar days should preview details on hover");
assert(html.includes("calendarGrid\").addEventListener(\"focusin\""), "keyboard focus should preview calendar day details");
assert(!html.includes("calendarMini\").addEventListener(\"click\""), "removed mini month overview should not keep click listeners");
assert(html.includes("calendarPopover\").addEventListener(\"click\""), "calendar popover should support expanding extra income");
assert(html.includes("events.slice(0, 3)"), "selected-day detail should initially limit extra income events to three");
assert(html.includes("data-calendar-toggle=\"events\""), "selected-day detail should expose an event expand/collapse control");
assert(!html.includes(".week-card"), "mobile calendar should not use a duplicate weekly card rail");
assert(!html.includes('id="calendarMobile"'), "calendar should not render the duplicate mobile weekly rail");
assert(!html.includes(".mini-day"), "calendar should not keep mini month dot styles");
assert(html.includes("calendarProjected"), "calendar summary and detail should show projected month/day income");
assert(html.includes("calendarDetailFuture"), "future calendar days should have localized detail copy");
assert(html.includes('calendarSectionTitle: "月曆"'), "Chinese calendar title should read 月曆");
assert(!html.includes('calendarSectionTitle: "月曆表"'), "Chinese calendar title should not read 月曆表");
assert(html.includes("@keyframes calendarPulse"), "today calendar cell should have a subtle breathing highlight");
assert(html.includes(".day-cell.future"), "future calendar days should have dim styling");
assert(html.includes(".day-cell.earned"), "earned calendar days should have completed-income styling");
assert(html.includes("rgba(240, 223, 182, 0.34)"), "earned calendar days should use a soft champagne wash");
assert(html.includes("rgba(216, 189, 130, 0.18)"), "earned calendar days should use a low-opacity champagne tint");
assert(html.includes("0 8px 16px rgba(184, 148, 86, 0.07)"), "earned calendar days should use a lighter shadow");
assert(html.includes("function formatShortMoney(amountHkd"), "calendar should have a short K/M money formatter");
assert(html.includes(".calendar-metric.progress strong {\n      color: #202225;\n    }"), "calendar earned metric should use black text instead of cyan");
assert(html.includes("formatShortMoney(data.base + data.extra)"), "calendar day amounts should use short K/M formatting");
assert(html.includes("formatShortMoney(data.extra)"), "calendar bonus amounts should use short K/M formatting");
assert(!html.includes("#fff4cf 0%, #f0dfb6 36%, #d8bd82 68%, #b89456 100%"), "earned calendar days should not use the old solid champagne block");
assert(!html.includes("#a57c5d"), "earned calendar days should not use the rejected brown color");
assert(!html.includes("#6f5140"), "earned calendar days should not use the rejected dark brown color");
assert(html.includes('<option value="tutoring">Tutoring</option>'), "extra income form should include tutoring income");
assert(html.includes('id="lessonDate" type="date"'), "tutoring income should capture lesson date");
assert(html.includes('id="lessonHours" type="number"'), "tutoring income should capture lesson duration");
assert(html.includes("function updateLessonFields()"), "tutoring fields should be shown only for tutoring income");
assert(html.includes("event.lessonDate"), "tutoring income should use the lesson date as the effective date");
assert(html.includes("incomeEvent.hourlyRate = Math.round((amount / lessonHours) * 100) / 100;"), "tutoring income should calculate hourly rate");
assert(html.includes('id="lessons"'), "Lessons analytics section should exist");
assert(html.includes('id="lessonModeToggle"'), "Lessons analytics should provide chart granularity controls");
assert(html.includes("function renderLessons()"), "Lessons analytics should render metrics, charts, and records");
assert(html.includes("function lessonSeries(events)"), "Lessons analytics should support per-lesson and monthly series");
assert(html.includes("function renderLineChart(series)"), "Lessons analytics should render the hourly-rate trend chart");
assert(html.includes("function renderIncomeChart(series)"), "Lessons analytics should render the income chart");
assert(html.includes("@keyframes lessonPointPulse"), "lesson chart points should have a breathing animation");
assert(html.includes("@media (prefers-reduced-motion: reduce)"), "lesson point animation should respect reduced motion");
assert(html.includes("chart-point-halo"), "lesson chart should include pulsing point halos");
assert(html.includes(".lesson-income-chart {\n      display: none;"), "lesson income chart should be folded into the main report panel");
assert(html.includes("min-height: 390px;"), "lesson chart should be readable on mobile without excessive vertical whitespace");
assert(html.includes("const width = 720, height = 390;"), "lesson chart SVG should use a compact mobile-readable viewBox");
assert(html.includes("const barW = Math.max(8, Math.min(24, barSlot * 0.42));"), "lesson income bars should be visible but still compact");
assert(html.includes('class="chart-hover-zone" tabindex="0"'), "lesson chart bars should expose hover/focus detail zones");
assert(html.includes("chart-tooltip"), "lesson chart should include hover/tap tooltips");
assert(html.includes('font-size="21" font-weight="820"'), "lesson chart title labels should be readable on mobile");
assert(html.includes('font-size="18" font-weight="820"'), "lesson chart date labels should be readable on mobile");
assert(html.includes('width="232" height="66"'), "lesson chart tooltip should be large enough on mobile");
assert(html.includes("chart-point:not(.is-highlight) .chart-point-halo"), "lesson chart should only pulse highlighted points");
assert(html.includes('text-anchor="middle"'), "lesson chart should use a compact latest value marker instead of crowded summaries");
assert(!html.includes("LATEST"), "lesson chart should not crowd the plot with redundant summary labels");
assert(html.includes("return \"\";"), "legacy standalone income chart renderer should be disabled");
assert(fs.existsSync("DESIGN_GUIDELINES.md"), "design guidelines should exist for future UI work");
assert(fs.readFileSync("DESIGN_GUIDELINES.md", "utf8").includes("Pre-Design Checklist"), "design guidelines should include a pre-design checklist");
assert(html.includes("lessonAvgRate"), "Lessons analytics should expose localized summary metrics");

console.log("All income core tests passed.");
